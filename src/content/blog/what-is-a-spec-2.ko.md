---
title: 명세란 무엇인가(2)
date: '2026-09-01'
summary: 명세에 대한 고찰 두 번째.
language: ko
unlisted: false
---

[이전 글](/blog/what-is-a-spec/)에서는 검증에서 흔히 사용하는 명세와 SpecTec 명세가 어떻게 다른지를 여러 축에서 비교했다. 이번에는 한 발짝 더 물러서서, 명세가 무엇을 표현하는지, 그리고 같은 의도된 동작을 왜 서로 다른 형태의 명세로 표현하게 되는지를 살펴보려 한다.

### 명세란 존재하는가

많은 프로그램에는 명세라고 부를 만한 문서가 존재하지 않는다. 하지만 의도된 동작은 분명 존재한다. 이를 확인할 수 있는 아주 간단한 사고실험은 코드 변경 시에 bug fix와 feature의 구분이다. 두 가지 다 관측 가능한 동작이 바뀌기 때문에, 의도된 동작이 없다면 bug fix와 feature는 구분이 불가능해야 한다. 하지만 명세가 없는 프로그램이라도, 대부분의 경우에 정상 동작인지 고쳐야 할 bug인지는 프로그래머가 구분할 수 있다.

즉 의도된 동작으로서의 가상의 명세는 항상 존재한다. 물론 이 가상의 명세는 여러 사람의 머릿속에 흩어져 있거나 서로 모순될 수 있고, 아직 결정되지 않은 부분도 있을 수 있다. 하지만 가상이건 실체가 있건, 어떤 형태를 갖추었건 모든 명세의 공통점은 "의도된 동작"을 표현한다는 점이다. 조금 더 formal하게 표현하면, 프로그램의 의도된 동작이 어떤 집합 $B$를 이룬다고 했을 때, 명세는 이 $B$에 대한 정보를 유한한 형태로 표현한다.

### 명세의 형태

프로그램의 동작을 이야기하려면 먼저 동작을 정의해야 한다. 이전 글에서는 한 번의 실행에서 관찰하기로 한 event만 순서대로 남긴 것을 trace라고 정의했다. 이번에는 input까지 포함하여 프로그램의 behavior를

$$
B \subseteq I \times T
$$

로 정의한다. 여기서 $(i, t) \in B$는 입력 $i$에 대해 trace $t$가 의도된 동작 중에 하나라는 뜻이다. 대부분의 프로그램에서 $B$는 매우 크거나 무한하므로 원소를 모두 나열하는 것은 불가능하다. 따라서 명세를 작성한다는 것은 거대한 $B$에 대한 정보를 유한한 형태로 표현하는 일이다. 그 방법을 크게 세 가지로 나누어 보겠다.

첫 번째 방법은 원소(element)를 나열하는 것이다. 이 방법은 입출력 예제에 해당한다. $B$에 속하는 원소(positive test)나, $B$에 속하지 않는 원소(negative test)를 나열함으로써 $B$에 대한 정보를 줄 수 있다. 개별 원소의 membership을 매우 구체적으로 보여주지만, $B$가 크거나 무한한 경우에는 나열만으로는 설명이 어렵다는 scalability 한계가 있다. 따라서 원소의 나열은 $B$ 자체를 정의하기보다는 $B$와 $B^C$의 대표적인 몇몇 점을 알려주는 역할을 한다.

두 번째 방법은 논리적 제약조건(constraint)으로 집합의 경계를 설명하는 것이다 . 이 제약조건이 표현하는 behavior 집합을 $B'$이라고 하자. 가령 어떤 명제 $P$에 대해 $B' = \lbrace b \ | \ P(b) \rbrace$라고 하면, 하나의 식으로 많은 behavior를 한꺼번에 기술할 수 있다. Hoare logic의 pre/post-condition이나 axiomatic semantics이 여기에 해당한다. 이전 글에서 다뤘듯이, 검증에서 사용하는 명세는 의도된 동작의 모든 세부사항보다는 구현이 반드시 만족해야 할 조건을 기술하는 경우가 많기 때문에, 대게 $B \subseteq B'$인 over-approximation $B'$을 기술한다. 몇 개의 조건만 적어도 $B'^C$를 한꺼번에 배제할 수 있기 때문에 크고 복잡한 집합을 표현함에 있어 나열보다 효율적이다. 이런 constraint는 어떤 behavior가 허용되는지를 효과적으로 기술하지만, input에서 behavior를 얻는 방법은 설명하지 않는다.

세 번째 방법은 input으로부터 집합의 원소를 만들어내는 계산 과정(computation)을 설명하는 것이다 . $B$가 $(i, t)$의 집합이므로, input을 받아 input에 대응하는 trace를 계산하는 과정을 나타낼 수 있다. 가장 단순산 deterministic한 경우에는 $B' = \lbrace (i, F(i)) \ | \ i \in I \rbrace$라고 정의한 후 $F$를 설명하는 방식이다. Reference implementation이나 operational semantics가 이 경우에 해당한다. 복잡한 behavior를 구체적으로 표현할 수 있지만, 그만큼 계산과정을 상세히 기술하기 위한 수고가 들어가기도 한다. 또한 여러 가능한 동작을 표현하려면 별도의 choice나 search 기능이 필요하다.

위의 세 방법은 formal/informal 구분과는 독립적이다. Element는 informal example일 수도 있고 바로 실행할 수 있는 테스트일 수도 있다. Constraint는 자연어 requirement일 수도 있고 first-order logic일 수도 있다. Computation은 pseudocode일 수도 있고 formal operational semantics일 수도 있다. 세 가지 설명 방식과 형식성의 정도가 합쳐져 우리가 아는 명세의 여러 형태를 만들어낸다. 그리고 소프트웨어 종류와 명세 활용 목적에 따라서 사용되는 형태가 달라진다.

### 일반 소프트웨어 명세

일반 소프트웨어의 경우, 함수, 모듈, API라는 자연스러운 abstraction boundary가 존재하며, 많은 경우에 caller관점에서의 guarantee가 관심 대상이다. 이때 caller는 내부 계산과정을 모두 알 필요 없이, 주어진 입력이나 상태에서 component가 무엇을 보장하는지만 알면 된다. 따라서 constraint, 특히 pre/post-condition 형태의 명세가 behavior를 요약하기에 매우 적합하다. 물론 각 함수 내부에도 여러 분기가 존재하지만, contract는 대체로 이들을 그대로 노출하기보다는 여러 내부 case의 구조를 abstraction boundary에서 하나의 contract로 요약한다.

### 프로그래밍 언어 명세

PL semantics의 입력은 일반적인 함수 입력과 다른 구조를 가진다. PL semantics의 입력인 프로그램은 `Expr`, `Stmt`, `Decl`, `Type` 등의 syntactic construct가 다시 자기 자신이나 다른 construct를 포함하는 recursively generated structure를 가지고 있다. 프로그래밍 언어 명세가 일반 소프트웨어 명세와 다른 특수한 형태를 지니는 중요한 이유 중 하나가 바로 이 재귀적인 입력 구조다. 일반 소프트웨어의 입력도 재귀적일 수 있지만, PL semantics에서는 입력 공간 전체가 재귀적인 grammar에 의해 생성되고, 그 전체 공간의 semantics를 정의해야 한다는 점에서 이 구조가 명세의 중심이 된다.

재귀적인 입력 공간 전체를 다루려면 semantics역시 syntax 형태를 따라 나누어 정의하는 것이 자연스럽다. 예를 들어 expression이

$$
e \ \dblcolon= n \ | \ e + e \ | \ \mathsf{if} \ e \ \mathsf{then} \ e \ \mathsf{else} \ e \ | \ {...}
$$

와 같이 정의되어 있다면, semantics도 `literal`, `add`, `if`로 case를 나누어 작성할 수 있다. 각 case는 다시 subexpression의 semantics를 사용하여 더 큰 expression의 semantics를 정의한다. 즉 입력을 syntax constructor에 따라 decompose하는 과정이 semantics의 정의 구조가 된다.

syntax에 따라 case로 나누는 것만으로는 아직 모든 프로그램을 설명할 수 없다. `add` case 하나는 특정한 크기의 expression만을 설명하는 것이 아니라, 그 안의 `e1`과 `e2`가 다시 임의의 expression일 때에도 적용되어야 한다. 즉 유한한 수의 syntax case로 임의의 깊이를 가진 무한한 입력 공간 전체를 다루려면, 작은 입력에 대해 정의된 semantics로부터 더 큰 입력의 semantics를 반복해서 구성할 수 있어야 한다.

이 반복적인 구성을 유한한 명세로 표현하려면 semantics를 재귀적으로 정의해야 한다. Syntax가 `literal`에서 시작하여 `add`, `if`, `call` 등의 constructor를 반복해서 적용해 얻어지는 가장 작은 집합이라면, semantics 역시 각 constructor에 대해 subexpression의 semantics를 가정하고 더 큰 expression의 semantics를 정의하는 방식으로 전체 입력 공간으로 확장할 수 있다. 함수의 형태로 쓰면 structural recursion이 되고, relation의 형태로 쓰면 inference rule을 이용한 inductive definition으로 표현할 수 있다. 구체적인 semantic formalism에 따라 이 재귀적인 구조를 표현하는 방식은 달라지지만, 많은 PL semantics가 syntax의 recursive structure를 명세의 구조로 활용한다는 점은 공통적이다.

이렇게 재귀적으로 정의된 syntax와 semantic derivation은 각각 증명에서도 induction principle을 제공한다. Syntax tree의 constructor를 따라 증명하는 것을 structural induction이라고 하고, inference rule로 정의된 derivation에 대해 induction을 할 수도 있다. 전자는 syntax constructor에 따라, 후자는 derivation의 각 rule에 따라 proof case가 나뉜다.

### PL 명세의 구조적 이점

Syntax structure에 따라 명세를 작성하면 case 구조가 명시적으로 드러난다. 서로 다른 constructor끼리는 이미 disjoint하며, 모든 constructor를 다뤘는지 exhaustiveness를 확인하기도 수월하다. 같은 constructor 안에서 조건에 따라 여러 rule로 나뉘는 경우에는 별도의 검사가 필요하지만, 어떤 case를 빠짐없이 다루어야 하는지는 여전히 명세의 구조에 드러난다.

이 case-analysis 구조는 증명에도 그대로 활용할 수 있다. 위에서 설명한 두 induction은 각각 syntax constructor와 semantic rule을 따라 proof case를 나누기 때문에, 명세에 드러난 case 구조가 proof obligation을 나누는 구조에 대응된다.

같은 구조는 테스트에서도 유용하다. 명세의 case가 exhaustive하고 disjoint하다면 각 case를 독립적인 coverage target으로 사용할 수 있고, 아직 테스트되지 않은 behavior case도 명확하게 드러난다. 명세의 case-analysis 구조를 활용하면 intended behavior를 기준으로 한 커버리지를 측정하고 정의할 수 있다.

### SpecTrum 연구는 이 이점을 일반 소프트웨어 명세에 가져온다

일반 소프트웨어의 함수도 많은 경우 의미적으로 구분되는 여러 behavior case를 가진다. 기존의 pre/post-condition은 이런 case를 하나의 논리식으로 요약할 수 있지만, 경우에 따라서는 case 구조를 명세에 보존하는 편이 유용할 수 있다. 만약 명세 언어가 behavior를 case-analysis 기반으로 작성할 수 있도록 하고 각 case의 disjoint/exhaustive 여부를 검사해준다면, PL semantics에서 활용하던 구조적인 이점을 일반 소프트웨어 명세에서도 활용할 수 있다.

이 때 명세의 behavior case와 구현의 branch는 구분할 필요가 있다. 구현의 branch는 control flow를 위한 것으로 최적화나 자료구조와 같은 implementation detail에 따라 달라질 수 있고, 같은 명세를 만족하는 구현끼리도 전혀 다른 control flow를 가질 수 있다. 반대로 명세에서 서로 다른 behavior로 구분하고 싶은 경우가 구현에서는 하나의 branch로 처리되는 경우도 있다. 즉 명세의 case는 실행 경로가 아닌 의도된 behavior space의 partition을 표현한다.

SpecTrum 연구에서 한 두 가지 중 첫 번째가 implicit exception을 명시하는 것이라면, 두 번째가 바로 이 부분이다. 명세에서 의미가 있는 behavior case를 나누어, case-analysis구조로 다시 작성했다. 이에 따라 커버리지가 if문과 fallthrough로 이루어진 control flow에 숨겨지는 것이 아니라, 의도된 partitioning에 맞게 측정될 수 있도록 한 것이 핵심이다.

따라서 지금은 우선 SpecTrum에서 배운 점을 활용해 명세 기계화 프레임워크 자체에서 case-analysis를 지원하고 활용할 수 있게 해보려고 한다. 일반적인 logical condition의 exhaustiveness나 disjointness를 정적으로 완벽하게 검사할 수는 없다. 그러나 pattern matching처럼 syntactic하게 결정 가능한 경우에는 정적으로 검사하고, 더 일반적인 predicate에는 solver를 사용하거나 확인하기 쉬운 형태로 case를 작성하도록 language가 유도할 수 있다. 중요한 것은 모든 조건을 완벽하게 자동 판정하는 것이 아니라, 명세 작성자가 의도한 behavior case를 도구가 분석할 수 있는 구조로 드러내는 것이다.
