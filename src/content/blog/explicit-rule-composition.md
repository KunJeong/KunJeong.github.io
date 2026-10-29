---
title: Explicit case analysis for inference rules
date: '2026-10-29'
summary: A feature proposal for nested and flat inference rules, explicit case selection, and diagnostics for failed assertions.
language: en
unlisted: true
---

Inference rules describe individual cases well. How those cases fit together is left implicit: which work they share, which conditions select an alternative, and what failure means after selection.

This proposal adds explicit case analysis, written in nested form or flat form. The nested form uses case blocks to group shared premises and the alternatives that follow them. The flat form presents each complete inference rule separately. This is a feature proposal, and implementation is incomplete.

## Motivation

Consider the IF0 rules in SpecTec's [RFAE evaluator](/examples/explicit-case-analysis/rfae.spectec). The source and recorded compiler behavior below refer to spectec-core revision `ef81b8e5d`.

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v

rule Eval_expr/if0-nz:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- if v_cond =/= (_NUM 0)
  -- Eval_expr: env |- e_3 ==> v
```

The intended decision is simple.

- Evaluate `e_1`.
- If its value is `_NUM 0`, evaluate `e_2`.
- Otherwise, evaluate `e_3`.

Each rule is readable on its own, but the pair exposes four problems:

- **Duplicated premises create a maintenance burden.** Both rules evaluate `e_1`. Changing that shared computation requires editing both copies, and nothing in the source ties those edits together.
- **Readers must reconstruct and check the case analysis.** The reader must identify the shared evaluation, recognize the output pattern `_NUM 0` and the condition `v_cond =/= (_NUM 0)` as alternatives, and check that they cannot both apply and leave no value uncovered. The structurer recovers a decision structure from the rules, but the reader must recover it independently.
- **Failure in the selected rule does not stop rule search.** Once `e_1` produces zero, a failure while evaluating `e_2` should explain why this IF0 judgment fails. The rule cannot say to stop there. IL instead tries the nonzero rule, attempting its premises even though its condition must reject zero. The judgment ultimately fails, but only after this unnecessary attempt.
- **Diagnostics must separate the cause from rejected alternatives.** The useful explanation is the failure inside `e_2`. The nonzero rule's rejection of zero is expected and adds no explanation. Without an explicit distinction between selecting a case and checking its body, a failure trace can leave the reader to determine which failed premise explains the result.

These are symptoms of two bigger issues. The first two problems arise because a shared computation followed by a choice is represented as independent rules. The source duplicates the computation and leaves its relationship to the alternatives implicit. The last two arise because `if` premises serve two roles: *selecting* an alternative and *asserting* a requirement within it. Rule search treats a rejected alternative and a failed body alike, continuing with another rule in either case.

The proposal addresses these issues together. A **nested authoring form** writes shared premises once and groups the alternatives that follow them. **Explicit `case` premises** distinguish the conditions that select an alternative from the assertions inside it. The conditions on nested branches become `case` premises in the corresponding flat rules, so the two forms express the same case analysis.

In nested form, the same definition would read:

```spectec
case if0: env |- (IF0 e_1 e_2 e_3) ==> v {
  -- Eval_expr: env |- e_1 ==> v_cond
  case z: v_cond = (_NUM 0) {
    -- Eval_expr: env |- e_2 ==> v
  }
  case nz: otherwise {
    -- Eval_expr: env |- e_3 ==> v
  }
}
```

The `IF0` input pattern selects the outer case, whose shared premise evaluates `e_1`. The inner cases then choose between zero and every other value, including closures. These input patterns and case conditions are **selectors**: they determine which alternative applies.

Once the interpreter selects a case, it commits to that case. If it selects the zero case and evaluating `e_2` fails, the interpreter reports failure for the IF0 judgment without trying the nonzero case. Each Boolean `if` premise within a case is an **assertion**. If an assertion is false or a required judgment has no result, the interpreter stops at that premise. It propagates the failure through enclosing cases without revisiting earlier choices.

The corresponding flat form presents each complete rule separately:

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- case v_cond = (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v

rule Eval_expr/if0-nz:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- case otherwise
  -- Eval_expr: env |- e_3 ==> v
```

Authors can edit either form. The nested form shows shared premises and alternatives together, while the flat form lets a reader inspect a complete rule on its own. Converting between them lets authors maintain one definition and use whichever form is easier to read or edit.

## Proposed architecture

![Explicit case analysis in the SpecTec pipeline](/images/rule-composition-architecture.svg)

The nested form is the main source of truth. A new denesting pass translates nested rules into flat EL rules. Flat EL rules retain `case` premises so that edits to the flat form can be converted back to the nested form. This conversion should be a one-to-one mapping of the supported rule structures, preserving case labels and premise contents. The [conversion example](#conversion) describes the restrictions and ordering conventions.

Elaboration checks that no input satisfies two `case` selectors at the same choice. Such selectors are **disjoint**. IL retains the case premises and the distinction between selection and assertions.

For definitions with checked, disjoint cases, the IL interpreter uses committed execution instead of rule search. It evaluates shared premises, tests selectors, and executes the selected case. If the selected case fails, the interpreter propagates that failure without trying another alternative. This avoids unnecessary rule attempts and lets diagnostics identify the failed assertion or required judgment along the selected path.

Structuring uses the explicit `case` information to build the SL algorithm, then optimizes it and improves its presentation. Following stages are unchanged because SL already has `CaseI` to represent case analysis.

The disjointness check guarantees that at most one alternative applies to each input. Intentional nondeterminism requires [explicit opt-in](#overlapping-relations).

## Benefits at a glance

| # | Pain point | Benefit |
| --- | --- | --- |
| 1 | Every edit to shared premises must be repeated across rules | Write shared premises once |
| 2 | Readers must reconstruct the choices and check their overlap and coverage | Expose and check case analysis |
| 3 | A failed condition can reject an alternative or fail its body | Distinguish selection from assertions |
| 4 | One `otherwise` per definition requires explicit complements or separate helpers | Scope `otherwise` to each choice |
| 5 | `otherwise` conflates remaining-input selection with recovery after failure | Make recovery explicit |
| 6 | Failure traces obscure the failed assertion among unrelated candidates | Report failures in the selected case |
| 7 | Grouping shared premises can obscure individual rules and complicate extensions | Keep nested and flat rules interchangeable |

## Benefits and examples

<details id="shared-premises">
<summary><strong>1. Write shared premises once</strong></summary>

**Problem.** Shared computations must be edited in every rule that repeats them. Both IF0 rules evaluate `e_1`:

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v

rule Eval_expr/if0-nz:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- if v_cond =/= (_NUM 0)
  -- Eval_expr: env |- e_3 ==> v
```

**Proposed nested form.** Put the shared premise before the alternatives:

```spectec
case if0: env |- (IF0 e_1 e_2 e_3) ==> v {
  -- Eval_expr: env |- e_1 ==> v_cond
  case z: v_cond = (_NUM 0) {
    -- Eval_expr: env |- e_2 ==> v
  }
  case nz: otherwise {
    -- Eval_expr: env |- e_3 ==> v
  }
}
```

**Benefit.** If evaluation needs an additional environment parameter, the author changes the shared call once. Denesting carries that edit into both flat rules. The branches cannot accidentally retain different versions of the shared computation.

Sharing requires identical premises, including variable names. The nested form records that shared premise directly.

</details>

<details id="overlap">
<summary><strong>2. Expose and check case analysis</strong></summary>

**Problem.** Overlapping rules can produce different results when structuring regroups them. This is the relation from the [overlap probe](/examples/explicit-case-analysis/reorder.spectec):

```spectec
rule T/one:
  n ~> 1
  -- if $(n > 5)
  -- if $(n > 100)

rule T/two:
  n ~> 2
  -- if $(n > 3)

rule T/three:
  n ~> 3
  -- if $(n > 5)
```

At revision `ef81b8e5d`, `T 10` returned `2` in IL and `3` in SL and PL. Structuring grouped the two `n > 5` tests, moving the third rule ahead of the second.

**Proposed flat form.** Marking the first tests as selectors exposes the conflict:

```spectec
rule T/one:
  n ~> 1
  -- case $(n > 5)
  -- if $(n > 100)

rule T/two:
  n ~> 2
  -- case $(n > 3)

rule T/three:
  n ~> 3
  -- case $(n > 5)
```

**Benefit.** The checker rejects this definition before structuring because all three selectors accept `10`. The failed assertion `10 > 100` does not make the first selector disjoint. Authors must resolve the overlap explicitly, and readers can see which conditions define the alternatives.

For `n = 3`, none of the selectors applies. The checker can also identify this uncovered input.

</details>

<details id="selection-and-assertions">
<summary><strong>3. Distinguish selection from assertions</strong></summary>

**Problem.** An `if` premise cannot distinguish rejecting an alternative from failing a case that already applies. These RFAE rules use `if` for both purposes:

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v

rule Eval_expr/if0-nz:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- if v_cond =/= (_NUM 0)
  -- Eval_expr: env |- e_3 ==> v

rule Eval_expr/id:
  env |- x ==> $lookup(env, x)
  -- if x <- $domain(env)
```

The nonzero test selects an IF0 branch. The domain test requires an identifier to be bound. Consider `IF0 (_NUM 0) (_ID "missing") (_NUM 1)` in an empty environment. The IL interpreter evaluates the condition to zero and attempts to evaluate `e_2`. The identifier is absent from the environment, so the domain test fails. The interpreter then retries the nonzero IF0 rule and rejects it because the condition value is zero. The source cannot say that the failure in `e_2` should end this IF0 judgment.

**Proposed nested form.** Separate the branch selectors from the identifier's assertion:

```spectec
case if0: env |- (IF0 e_1 e_2 e_3) ==> v {
  -- Eval_expr: env |- e_1 ==> v_cond
  case z: v_cond = (_NUM 0) {
    -- Eval_expr: env |- e_2 ==> v
  }
  case nz: otherwise {
    -- Eval_expr: env |- e_3 ==> v
  }
}

case id: env |- x ==> $lookup(env, x) {
  -- if x <- $domain(env)
}
```

**Benefit.** After evaluating the condition to zero, the interpreter commits to evaluating `e_2`. The identifier’s domain assertion is false, so evaluation of `e_2` fails. The interpreter propagates that failure without attempting the nonzero rule. The author can express both which case applies and when that case must fail.

</details>

<details id="local-complements">
<summary><strong>4. Scope <code>otherwise</code> to each choice</strong></summary>

**Problem.** The limit of one `otherwise` per definition requires authors to write additional complements explicitly or move those choices into helpers. Mini-ML's `$subst(e, x, v)` replaces free occurrences of `x` with `v`. It uses `$subst_var` and `$subst_fun` to give each equality choice its own `otherwise`:

```spectec
def $subst_var(y, x, v) = v
  -- if x = y
def $subst_var(y, x, v) = Evar y
 -- otherwise

def $subst_fun(y, e1, x, v) = Efun y e1
  -- if x = y
def $subst_fun(y, e1, x, v) = Efun y $subst(e1, x, v)
  -- otherwise


def $subst(Ecst n, x, v) = Ecst n
def $subst(Eop op, x, v) = Eop op
def $subst(Evar y, x, v) = $subst_var(y, x, v)
def $subst(Eapp e1 e2, x, v) = Eapp $subst(e1, x, v) $subst(e2, x, v)
def $subst(Efun y e1, x, v) = $subst_fun(y, e1,x, v)
def $subst(Elet y e1 e2, x, v) = Elet y $subst(e1, x, v) e2
  -- if x = y
def $subst(Elet y e1 e2, x, v) = Elet y $subst(e1, x, v) $subst(e2, x, v)
  -- otherwise
def $subst(Epair e1 e2, x, v) = Epair $subst(e1, x, v) $subst(e2, x, v)
```

**Proposed flat form.** Each input constructor has its own choice, so all three complements fit directly in `$subst`:

```spectec
def $subst(Ecst n, x, v) = Ecst n
def $subst(Eop op, x, v) = Eop op

def $subst(Evar y, x, v) = v
  -- case x = y
def $subst(Evar y, x, v) = Evar y
  -- case otherwise

def $subst(Eapp e1 e2, x, v) = Eapp $subst(e1, x, v) $subst(e2, x, v)

def $subst(Efun y e1, x, v) = Efun y e1
  -- case x = y
def $subst(Efun y e1, x, v) = Efun y $subst(e1, x, v)
  -- case otherwise

def $subst(Elet y e1 e2, x, v) = Elet y $subst(e1, x, v) e2
  -- case x = y
def $subst(Elet y e1 e2, x, v) = Elet y $subst(e1, x, v) $subst(e2, x, v)
  -- case otherwise

def $subst(Epair e1 e2, x, v) = Epair $subst(e1, x, v) $subst(e2, x, v)
```

**Benefit.** Two helpers disappear. Each `otherwise` complements the equality test for its own constructor, so the author can read and maintain substitution in one definition. Adding a sibling narrows only that choice's complement.

[Original Mini-ML source](/examples/explicit-case-analysis/miniml.spectec), spectec-core revision `ef81b8e5d`.

</details>

<details id="recovery">
<summary><strong>5. Make recovery explicit</strong></summary>

**Problem.** `otherwise` does not distinguish remaining inputs from recovery after a failed check. P4's text helper uses it to return `false` when either the length check or the prefix check fails:

```spectec
def $starts_with(t, t_prefix) = true
  -- if $(|t_prefix| <= |t|)
  -- if t[0 : |t_prefix|] = t_prefix
def $starts_with(t, t_prefix) = false
  -- otherwise
```

For `$starts_with("a", "ab")`, the inputs match the first clause, but its length check fails. The `otherwise` clause turns that failure into `false`.

**Proposed flat form.** Declare that recovery explicitly. The `default def` spelling is provisional:

```spectec
def $starts_with(t, t_prefix) = true
  -- if $(|t_prefix| <= |t|)
  -- if t[0 : |t_prefix|] = t_prefix
default def $starts_with(t, t_prefix) = false
```

**Benefit.** The checks remain requirements of the selected computation, and the default explicitly converts their failure to `false`. A `case otherwise` would only select inputs left by sibling selectors, so it could not recover from either failed check here.

The default handles **ordinary failure**, meaning a failed assertion or a required judgment with no result. The interpreter evaluates the default with the original arguments. Local variables from the failed body are unavailable. The interpreter does not invoke the default after a successful result, including `false`. Runtime errors, such as out-of-bounds accesses, still propagate.

[Original P4 helper source](/examples/explicit-case-analysis/p4-stdlib.spectec), spectec-core revision `ef81b8e5d`.

</details>

<details id="diagnostics">
<summary><strong>6. Report failures in the selected case</strong></summary>

**Problem.** Rule search can mix the failed assertion with rejections from unrelated alternatives. Consider this RFAE expression in an empty environment:

```spectec
IF0 (_NUM 0) (_ID "missing") (_NUM 1)
```

When the IL interpreter evaluates this expression, the identifier’s domain check fails. The interpreter then tries the nonzero IF0 rule and rejects it because the condition value is zero.

**Proposed flat form.** Explicit selection identifies the path whose failure should be reported:

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- case v_cond = (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v

rule Eval_expr/id:
  env |- x ==> $lookup(env, x)
  -- if x <- $domain(env)
```

**Benefit.** The diagnostic can identify `Eval_expr/if0-z` as the calling rule and point to the failed assertion `x <- $domain(env)`. It can show the relevant values, `x = _ID "missing"` and `env = eps`. The nonzero IF0 case is irrelevant to the failure and does not clutter the trace.

Retaining case paths, source locations, and bindings distinguishes a failed assertion, a required judgment with no result, and an input for which no case applies.

</details>

<details id="conversion">
<summary><strong>7. Keep nested and flat rules interchangeable</strong></summary>

**Problem.** Readers must assemble an inner case's complete rule from its enclosing cases. Here, `z` inherits both the IF0 judgment and the evaluation of `e_1`:

```spectec
case if0: env |- (IF0 e_1 e_2 e_3) ==> v {
  -- Eval_expr: env |- e_1 ==> v_cond
  case z: v_cond = (_NUM 0) {
    -- Eval_expr: env |- e_2 ==> v
  }
  case nz: otherwise {
    -- Eval_expr: env |- e_3 ==> v
  }
}
```

**Generated flat form.** Opening `Eval_expr/if0-z` exposes the whole rule:

```spectec
rule Eval_expr/if0-z:
  env |- (IF0 e_1 e_2 e_3) ==> v
  -- Eval_expr: env |- e_1 ==> v_cond
  -- case v_cond = (_NUM 0)
  -- Eval_expr: env |- e_2 ==> v
```

**Benefit.** Authors maintain the shared computation in nested form while readers can inspect, cite, or edit a complete rule. Flat edits can be converted back to nested form. Adding `-- if v =/= (_NUM 0)` to the flat `if0-z` rule inserts that assertion after the evaluation of `e_2` inside the nested `z` case. New flat rules can also be added beside nested cases and incorporated later.

Conversion has three structural constraints:

- Rules grouped in an outer case have textually identical input patterns. A **mode** specifies which judgment positions are inputs and which are outputs.
- Shared leading premises are textually identical, including variable names. The first differing premises must be selectors. An edit to only one copy of a shared premise would be reported as incompatible with that grouping.
- Inner cases inherit outer input patterns. Premises after a choice belong to individual branches, even if those branches repeat the same final check.

The round trip preserves case structure, labels, and premise contents. Flat rules are grouped by case, with branch order determined by first occurrence in the flat source. File ordering and formatting need not be preserved. Rule names identify paths and are checked against the structure, but do not determine behavior.

</details>

## Design questions

### What changes beyond notation?

The nested form is shorthand for flat rules with explicit `case` premises. The semantic changes are explicit selection, committed execution, and local `otherwise`. Disjointness checks validate the choices. Existing rules that rely on source order or recovery through sibling rules need that intent made explicit before they fit this model.

### Why not use SL as the authoring form?

SL already provides branches, nesting, and case analysis. Its execution, however, relies on invariants established by elaboration and structuring. Using SL as source would require authors to maintain those invariants. Its explicit instructions also make some operations more verbose than the corresponding source premises.

Individual inference rules remain useful for reading, citing, reasoning about, and extending a specification. Preserving those benefits is central to this proposal. The nested form adds shared premises and explicit case analysis while retaining complete rules that authors can inspect and edit. Elaboration and structuring remain responsible for producing executable SL.

### What happens to catch-all `otherwise` clauses?

Their treatment depends on their purpose. A clause for inputs left by sibling cases becomes a local `case otherwise`. A clause that recovers when a selected body fails becomes an explicit function default. [Benefit 5, “Make recovery explicit,”](#recovery) explains the distinction and the proposed recovery behavior.

### What can the checker establish?

The checker must distinguish a proven overlap, a proven gap, and “could not decide.” Constructor and tuple patterns, numeric intervals, and a condition paired with its negation are candidates for exact checking. The supported set remains to be defined. Arbitrary predicates cannot generally be checked this way.

For an undecided case, authors could be required to rewrite the selectors or allowed to supply a **disjointness claim**, stating that at most one alternative applies. Tests could check that claim on exercised inputs, but would not prove it. Whether claims are allowed remains a policy decision. An undecided check must not silently make source order determine selection.

### Must every input produce a result?

No. A definition may intentionally be partial, such as extracting the head of a nonempty list. Even exhaustive selectors do not guarantee a result, because assertions and required judgments can fail, and evaluation can diverge. How authors declare intentional gaps, and whether other gaps are warnings or errors, remains to be specified.

### How does the evaluation direction affect case analysis?

Inference rules can be interpreted in multiple *modes*, each specifying which judgment positions are inputs and which are outputs. For the integer relation `Sum: n_1 + n_2 = n_3`, one mode computes `n_3` from `n_1` and `n_2`. Another computes `n_2` from `n_1` and `n_3`.

The nested form preserves this basis for multi-mode execution by retaining complete judgments and their inference rules. Different modes make different inputs available for selection, so each mode needs its own case structure and disjointness check.

<a id="overlapping-relations"></a>

### What about intentional nondeterminism?

Intentional nondeterminism requires explicit opt-in. A definition that needs several applicable alternatives must declare that intent. Without this opt-in, selectors must be disjoint.
