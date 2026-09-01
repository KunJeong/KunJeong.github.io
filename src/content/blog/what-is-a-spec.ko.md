---
title: 명세란 무엇인가
date: '2026-08-24'
summary: 명세에 대한 고찰 첫 번째.
language: ko
unlisted: false
---

이 고민은 PLDI에서 시작되어, FSE, 검증워크샵과 여름학교를 거치며 선명해졌다. 질문은 "검증에서 말하는 명세와 SpecTec 명세는 어떻게 다르며 어떤 관계에 있는가?"였다. deductive verification, spec mechanization, lightweight formal method가 한 곳에 모이고 James와 명세에 대해 길게 토론하면서, 이 질문을 trace와 refinement의 관점에서 볼 수 있게 되었다. 기억이 생생할 때 정리하기 위해 돌아오는 비행기에서 골격을 쓰고, 귀국 후에 다듬었다. 결국 이 질문은 명세가 무엇을 관찰하고, 어떤 동작을 허용하며, 구현과 어떤 관계인지로 정리해볼 수 있다.

### 명세는 왜 필요한가

Deductive verification에서는 프로그램 전체를 한꺼번에 검증하기보다는 함수나 모듈 단위로 나누어 검증한다. 함수 단위로 나누는 경우를 가정하자. 어떤 함수를 호출할 때마다 그 함수의 구현을 펼쳐서 분석해야 한다면 검증이 modular하지 않다. 따라서 함수의 구현 대신 사용할 수 있는 동작의 요약이 필요하며, 함수의 precondition과 postcondition이 요약의 역할을 한다. postcondition은 함수 구현을 증명할 때는 증명 목표로, 함수를 사용하는 쪽에서는 가정으로 증명에 활용할 수 있기 때문에 함수 명세는 callee와 caller를 연결하는 interface 역할을 한다.

간단한 `swap`함수를 예시로 들면 이 명세의 개념이 더 명확해진다. 포인터 a와 b를 받아, 가리키는 값을 서로 바꾸는 함수를 생각해보자. a와 b가 유효한 포인터라는 precondition 아래, 다음과 같이 postcondition을 작성할 수 있다. (thanks to James)

```
assert(*a == old(*b))
assert(*b == old(*a))
```

`swap`을 구현하는 쪽에서는 이 두 조건을 증명해야 한다. 반대로 `swap`을 호출하는 쪽에서는 구현이 tmp를 사용하는지, XOR swap을 사용하는지에 관계없이 이 두 조건을 가정할 수 있다. 즉 명세는 내부 구현을 감추는 abstraction의 역할을 한다.

그러나 이 논리식이 `swap`의 실행을 완벽하게 표현하는 것은 아니다. 구현이 사용한 지역변수, 메모리 접근, 실행 시간 등은 나타내지 않는다. 구현이 값을 교환하면서 로그를 출력하거나 전역변수를 변경한다면 두 postcondition은 그런 동작을 놓치게 된다. 다시 말해 이 명세는 `swap`의 전체 실행을 재현하는 것이 아니라, 각 함수 경계에서 관심 있는 일부 동작을 기술한다.

### 관심 있는 동작이란 무엇인가

관심 있는 동작을 명확히 하려면 먼저 관찰하는(observable) 사건의 종류를 정해야 한다. 프로그램의 동작은 내부 상태 변화, 함수 호출, 메모리 접근, 입출력, 종료 등 많은 사건을 포함한다. 이 중 반환값만 관찰할 수도 있고, 외부 함수 호출과 I/O event까지 관찰할 수도 있으며, 특정 메모리 영역의 최종 상태를 포함할 수도 있다. 종료와 무한루프를 구분하고 싶다면 종료 여부 역시 포함해야 한다.

이때, 프로그램의 한 번의 실행에서 관찰하기로 정한 event만 순서대로 남긴 것을 trace라고 부르겠다. trace는 유한할 수도, 무한할 수도 있다. 같은 프로그램이라도 어떤 사건을 관찰 대상으로 정하느냐에 따라 trace가 달라질 수 있다. CRIS에서 사용하는 ITree를 예로 들자면, internal step인 tau는 제외하고 남은 input/output event의 sequence를 trace로 정의한다. 이 또한 관찰 대상에서 tau를 제외함에 따른 trace 정의라고 볼 수 있다.

관찰 대상을 고정하고 나면, 명세는 이렇게 정의된 trace의 집합으로 볼 수 있다. 명세가 반드시 실행 가능한 프로그램일 필요는 없다. 논리식, 입출력예제, reference interpreter 모두 어떤 trace가 허용되는지를 정하는 서로 다른 방법이다. 이 틀 안에서는 함수별 pre/postcondition 명세와 P4-SpecTec(이하 SpecTec)의 실행 가능한 명세를 같은 선상에 놓고 비교할 수 있게 된다.

### Trace equivalence, Trace inclusion

명세와 구현을 비교하려면, 같은 입력과 관찰 대상을 기준으로 삼아야 한다. 이를 정한 뒤에도, 명세와 구현 사이 성립해야 하는 관계는 명세의 역할에 따라서 달라진다. 명세가 프로그램의 observable behavior를 정확히 결정하고 싶다면, 구현과 명세가 같은 trace 집합을 가져야 한다 (trace equivalence).

$$
Traces(implementation) = Traces(specification)
$$

Reference interpreter를 실제 구현과 비교하는 경우가 이렇다. 내부 상태와 계산 과정이 달라도, 관찰 가능한 범위에서는 정확히 같은 동작을 보여야 한다.

반대로, 명세가 여러 구현을 허용한다면 구현의 trace가 명세가 허용하는 범위에 포함되면 충분하다 (trace inclusion).

$$
Traces(implementation) \subseteq Traces(specification)
$$

명세는 여러 가능한 동작을 허용하고, 구현은 그 중 일부를 선택할 수 있다. 그러나 구현이 명세에서 허용하지 않는 trace를 보이면 안 된다. 이 trace inclusion을 "구현이 명세를 refine한다"라고 말한다.

Trace equivalence는 mutual inclusion으로 볼 수 있다. 명세와 구현이 모두 deterministic하고 total하며 하나의 입력과 환경에 대해 정확히 하나의 trace를 만든다면 trace inclusion이 사실상 equivalence와 같아진다. 두 관계가 달라지는 것은 명세가 의도적으로 여러 trace를 허용하거나, 여러 환경에서 실행이 가능한 경우다.

### 명세는 동작의 일부만 기술한다

Trace equivalence와 inclusion의 구분은 명세가 구현 동작의 일부만 기술한다는 표현을 더 정교하게 해준다. 여기서 "일부만 기술한다"는 말에는 적어도 세 가지 의미가 있다. 명세는 실행 동작 중 일부만 관찰하고, 관찰된 동작도 여러 가능성을 허용할 수 있으며, 일부 입력에 한정해서 동작을 정의할 수도 있기 때문에 이를 구분하는 것이 중요하다.

첫째, 명세는 실행의 모든 측면이 아니라 관찰하기로 한 동작만 기술할 수 있다 (observation). `swap`의 명세가 호출 전후의 `*a`와 `*b`만 관찰한다면 지역변수, 중간 계산, 실행 시간 등은 trace에서 제외된다. 구현과 명세의 전체 동작이 다르더라도 선택한 관찰에 대해서는 trace가 동일할 수 있다. 이 경우 명세는 observable behavior를 유지하면서 내부 표현과 계산을 더 단순하게 만들 수 있다. 즉 관찰의 partiality는 명세와 구현의 비교에 있어 동작의 어떤 부분을 무시하는지를 의미한다.

둘째, 명세는 관찰한 동작에 대해 여러 결과를 허용할 수 있다 (trace space). 예를 들어 `swap`의 두 postcondition중 한 조건만 있다고 하자.

```
assert(*a == old(*b))
```

이 명세는 `*b`가 어떤 값을 가져야 하는지는 정하지 않았으므로 원본 `swap`명세보다 더 많은 trace를 허용하며, 같은 입력에 대해 여러 trace를 허용하므로 non-deterministic한 명세가 된다. 이 때 구현과 명세의 관계는 equivalence가 아닌 inclusion이 된다.

더 많은 trace를 허용하는 것이 항상 명세 오류는 아니다. `*b`에 대해 서로 다른 동작을 허용하는 것이 의도라면, 큰 trace집합은 구현의 자유를 표현하는 의도된 abstraction이다. 반대로 `*b`가 다른 값으로 정해지는 구현체를 허용하지 않는 것이 의도라면 조건을 빼먹은 underspecification이다. trace 집합만 비교하면 abstraction과 underspecification은 동일하기 때문에, 둘을 구분하기 위해서는 의도를 알아야 한다.

셋째, 명세는 일부 입력에 한정해서 동작을 기술할 수 있다 (input space). `swap`의 명세는 `a`와 `b`가 유효한 포인터라는 precondition을 요구할 수 있다. 유효하지 않은 포인터는 명세의 범위 밖에 있으므로 명세가 partial하다고 할 수 있다. 또한 명세와 구현의 trace를 비교할 때에도 precondition을 만족하는 입력만 비교하게 된다. 이 경우 precondition을 가정으로 사용할 수 있기 때문에 명세와 구현을 검증하는 것은 쉬워지나, caller에게 더 많은 precondition에 대한 증명 책임을 넘기게 된다.

Mike Dodds는 "a spec is just a simpler implementation"이라고 표현했다. 이 말은 executable specification을 이해하는 데에 큰 도움이 되었다. 다만 위의 세 가지 축을 기준으로 보면 "simpler"에 대한 해석도 나뉜다. observation을 줄이면 internal representation을 생략한 simpler implementation을 만들 수 있다. 더 많은 trace를 허용하면 여러 구현을 포함하는 more abstract specification을 만들 수 있다. 동작이 정의된 input space를 줄이면 처리해야 할 경우가 줄어들고 따라서 명세도 간결해진다.

simplification에는 한 가지 축이 더 있다. 세 가지 축을 고정한 상태에서도 구현에 들어간 최적화만 제거하거나 자료구조를 간단하게 변경하는 경우, 같은 입력에 대해서 같은 observable trace를 만들 수 있다. 이것이 마지막 네 번째 축, complexity가 된다. 따라서 특정 명세를 "simpler implementation"이라고 이야기할 때에는 무엇을 생략하거나 완화해서 단순해졌는지를 덧붙이는 것이 좋다.

네 가지 축을 토대로, determinism과 totality도 더 정확하게 구분할 수 있다. Deterministic한 명세는 고정된 입력과 환경에서 하나의 trace가 나온다. 그러나 deterministic한 명세도 동작의 일부만 관찰할 수 있고, 일부 입력에 대해서만 정의할 수 있다.

### SpecTec명세는 어떤 명세인가

이제 네 가지 축을 토대로 P4-SpecTec으로 작성된 명세의 성격을 더 정확히 설명할 수 있다. Observation 축에서는 현재 meta-interpreter가 반환한 최종 결과를 실제 구현체의 결과와 비교하므로, observable outcome은 이 결과값 하나(길이 1의 trace)라고 볼 수 있다. Trace space 축에서는 rule끼리 전부 disjoint하다면 완전히 deterministic한 명세다. Input space 축에서는, 마찬가지로 rule이 total하냐에 달려있다. 마지막으로 model complexity 축에서는 실제 P4 구현에 들어가는 최적화나 복잡한 데이터 구조 없이 간결하게 작성한다는 점에서 구현보다 단순하다. Mike가 말한 simpler implementation과 가장 직접적으로 대응되는 예시라고 볼 수 있다.

따라서 SpecTec 명세는 실제 구현의 최종 결과와 직접 비교할 수 있는 executable oracle로 작용한다. 각 relation의 조건이 disjoint하고 exhaustive하며 termination이 보장된다면, 모든 입력에 대해 결과가 하나로 정해지는 완벽한 oracle로 작용한다.

서로 다른 구현의 동작을 허용하고 싶다면, 어느 축에서 그 차이를 처리할지 결정해야 한다. 비교할 필요가 없는 차이를 observation에서 제외하는 것이 현재 방식이다. Architecture나 environment에 따라 결과가 달라지는 경우에는 이를 명세 입력의 parameter로 모델링할 수 있다. 같은 observation과 input에서도 여러 결과를 모두 허용해야 한다면 trace space 자체를 넓혀야 한다. 현재 명세 언어는 choice나 constraint solving을 지원하지 않고, meta-interpreter는 first match만 실행한다. 따라서 rule의 조건을 겹치게 작성하더라도 trace space가 넓어지지 않으며, 여러 trace를 표현하는 것은 현재로서는 불가능하다.

### 검증 명세와 SpecTec 명세의 (생각보다 중요한) 마지막 차이

앞에서 살펴본 명세는 프로그램을 함수 단위로 나누고 각 함수에 pre/post condition을 부여한다. 그리고 프로그램 전체의 검증은 각 함수 사이의 contract를 조합하여 이루어진다.

현재 SpecTec 명세는 이런 방식으로 나뉘어 있지 않다. 비교하는 대상은 정해진 몇 개의 entrypoint (typecheck, instantiate, evaluate)에 대한 전체 실행결과 뿐이다. 또한 SpecTec의 함수와 relation은 여러 개의 rule로 정의되어 있지만 공통의 pre/postcondition은 정의하지 않는다. 즉 각 함수의 구현을 감추거나, caller가 사용할 수 있는 contract를 제공하지는 않는다. 이 차이로 인해, 현재 구조 그대로 증명에 활용하려면 전체 실행 사이의 simulation이나 refinement를 보이는 것이 자연스럽다. 반대로 modular한 증명을 필요로 한다면 각 함수 단위에서 contract를 정의할 필요가 있다.

### 앞으로의 질문

SpecTec 명세와 검증을 연결하는 한 가지 방법은 전체 프로그램 수준에서 SpecTec과 실제 구현의 equivalence나 refinement를 증명하는 것이다. 그러나 SpecTec 명세가 허용하는 trace space가 아주 좁은 편이기 때문에 refinement 증명의 난이도가 굉장히 높을 것으로 예상된다.

다른 방법은 현재의 executable semantics를 유지하면서 semantic function과 relation에 대해 modular하게 사용할 수 있는 contract를 별도로 제공하여 증명하는 것이다. 이 contract는 SpecTec의 rule을 대체하지 않고, 여러 rule이 공통으로 보장하는 property를 요약해야 할 것이다. 이후 증명에서는 이 property를 사용하여 modular한 증명이 가능하다.

처음의 질문은 검증 명세와 SpecTec 명세가 같은 종류의 명세인지에 관한 것이었다. 지금까지의 결론은 observation, trace space, input space, model complexity뿐 아니라 명세의 단위와 composition 방식에서도 다르다는 것이다. 현재 SpecTec은 전체 프로그램의 의도된 결과를 계산하는 데 초점을 두고 있으며, 함수 단위의 modular interface는 명시되어 있지 않다. Type soundness 증명의 경우에는 well-typed인 전체 프로그램 실행을 비교하여 표현이 가능하지만, 같은 명세를 보다 다양한 증명에 활용하고 싶다면 modular contract가 있어야 할 것 같다는 것이 현재 도달한 결론이다.
