---
title: Marktoberdorf 2026 Trip Report
date: '2026-08-24'
summary: 2026년 8월 12일부터 21일까지 열흘간 참여한 Marktoberdorf Summer School에서 배우고 느낀 점입니다.
language: ko
---

### 서문

뮌헨으로 향하는 비행기는 약 13시간이었다. 생체시계를 미리 맞추기 위해, 잠을 최대한 생략하고 대부분의 시간동안 책을 읽고 생각을 했다. 《열한 계단》이라는 책이었다. 계단은 변증법의 단계에 대한 비유다. 정-반-합의 과정으로 정신이 성장하는 과정을 이야기의 뼈대삼아, 각 계단마다 기존 사고의 틀을 벗어나는 새롭고 이질적인 지식을 제시한다. 너무 재밌는 책이었지만, 책 후기는 생략하겠다.

변화의 시기였다. 변화가 필연적이었던 이유는 여태까지 삶의 모델로 잘 안 되는 것들이 늘었기 때문이다. 그래서 이 책을 골랐고, 내가 어느 계단 근처에서 헤매고 있었는지 갈피를 잡게 해주었다.

생각이 많아져 글을 썼다. 글이라기에는 고작 두 문단이고, 까먹지 않을 정도로 간략하게만 써놓았지만 풀어 쓰면 이런 내용이다.

> 지식과 지혜는 세 단계를 거쳐 성장한다. 세상 또는 나를 관찰해 패턴을 찾고 이를 정교하게 만드는 것이 첫 번째 단계. 이것이 체화되어 새로운 생각의 토대가 되거나 행동에서 드러나게 되는 것이 두 번째 단계. 그리고 나와 다른 맥락을 가진 타인을 설득할 때 세 번째 성장이 일어난다.

여태껏 나는 내면과 세상을 분리하는 것을 중요시해왔다. 내면을 드러내는 것은 자만이거나 기만일 뿐이었다. 좋은 의도와 큰 뜻이 있다면 바로 행동으로 옮기면 되지 굳이 남에게 설명할 필요는 없는 것이었다. 내 얘기를 하는 것이 가장 불편했다. 이렇게 살아온 결과 모든 성장이 번번이 두 번째 단계에 멈추고 세 번째를 놓치고 있었다. 계단을 오르려면, 불편함과 정면으로 부딪혀야만 했다.

### SpecTec 열풍

열풍은 다소 과장이다. 그러나 80명가량의 학생이 교수님의 강의를 들었고 상당수의 학생이 크게 감명을 받았다. Jean-Christophe는 수업시간에 가르치는 Mini-ML을 SpecTec으로 써보고 싶다고 하셨고 (후술), Mike Dodds는 SpecTec-in-Lean과 Go-in-SpecTec에 관심을 보였다. 학생들 중에도 SpecTec 명세의 활용에 관심을 보이는 경우가 있었는데, 검증에서 보통 생각하는 명세와 SpecTec명세의 차이를 명확히 설명할 수 있는 것이 중요하다고 느꼈다.

첫 주는 거의 매일 달리기를 했다. 달리는 동안의 컨텐츠와 페이스 조절을 위해 새로운 시도를 했다. 클로드 음성 모드로, 영어로 말하는 연습하기. 내가 이해한 내용을 설명하고 의문이 드는 부분을 물어보는 과정을 반복하며 빈 곳을 천천히 메워갔다. 설명을 잘하게 되는지는 아직 더 지켜봐야 하고, 장거리 달리기가 조금 더 재밌어졌다.

### 명세란 무엇인가

이 고민은 PLDI에서 시작되어, FSE, 검증워크샵과 여름학교를 거치며 선명해졌다. 질문은 "검증에서 말하는 명세와 SpecTec 명세는 어떻게 다르며 어떤 관계에 있는가?"였다. deductive verification, spec mechanization, lightweight formal method가 한 곳에 모이고 James와 명세에 대해 길게 토론하면서, 이 질문을 trace와 refinement의 관점에서 볼 수 있게 되었다. 기억이 생생할 때 정리하기 위해 돌아오는 비행기에서 골격을 쓰고, 귀국 후에 다듬었다. 결국 이 질문은 명세가 무엇을 관찰하고, 어떤 동작을 허용하며, 구현과 어떤 관계인지로 정리해볼 수 있다.

#### 명세는 왜 필요한가

Deductive verification에서는 프로그램 전체를 한꺼번에 검증하기보다는 함수나 모듈 단위로 나누어 검증한다. 함수 단위로 나누는 경우를 가정하자. 어떤 함수를 호출할 때마다 그 함수의 구현을 펼쳐서 분석해야 한다면 검증이 modular하지 않다. 따라서 함수의 구현 대신 사용할 수 있는 동작의 요약이 필요하며, 함수의 precondition과 postcondition이 요약의 역할을 한다. postcondition은 함수 구현을 증명할 때는 증명 목표로, 함수를 사용하는 쪽에서는 가정으로 증명에 활용할 수 있기 때문에 함수 명세는 callee와 caller를 연결하는 interface 역할을 한다.

간단한 `swap`함수를 예시로 들면 이 명세의 개념이 더 명확해진다. 포인터 a와 b를 받아, 가리키는 값을 서로 바꾸는 함수를 생각해보자. a와 b가 유효한 포인터라는 precondition 아래, 다음과 같이 postcondition을 작성할 수 있다. (thanks to James)

```
assert(*a == old(*b))
assert(*b == old(*a))
```

`swap`을 구현하는 쪽에서는 이 두 조건을 증명해야 한다. 반대로 `swap`을 호출하는 쪽에서는 구현이 tmp를 사용하는지, XOR swap을 사용하는지에 관계없이 이 두 조건을 가정할 수 있다. 즉 명세는 내부 구현을 감추는 abstraction의 역할을 한다.

그러나 이 논리식이 `swap`의 실행을 완벽하게 표현하는 것은 아니다. 구현이 사용한 지역변수, 메모리 접근, 실행 시간 등은 나타내지 않는다. 구현이 값을 교환하면서 로그를 출력하거나 전역변수를 변경한다면 두 postcondition은 그런 동작을 놓치게 된다. 다시 말해 이 명세는 `swap`의 전체 실행을 재현하는 것이 아니라, 각 함수 경계에서 관심 있는 일부 동작을 기술한다.

#### 관심 있는 동작이란 무엇인가

관심 있는 동작을 명확히 하려면 먼저 관찰하는(observable) 사건의 종류를 정해야 한다. 프로그램의 동작은 내부 상태 변화, 함수 호출, 메모리 접근, 입출력, 종료 등 많은 사건을 포함한다. 이 중 반환값만 관찰할 수도 있고, 외부 함수 호출과 I/O event까지 관찰할 수도 있으며, 특정 메모리 영역의 최종 상태를 포함할 수도 있다. 종료와 무한루프를 구분하고 싶다면 종료 여부 역시 포함해야 한다.

이때, 프로그램의 한 번의 실행에서 관찰하기로 정한 event만 순서대로 남긴 것을 trace라고 부르겠다. trace는 유한할 수도, 무한할 수도 있다. 같은 프로그램이라도 어떤 사건을 관찰 대상으로 정하느냐에 따라 trace가 달라질 수 있다. CRIS에서 사용하는 ITree를 예로 들자면, internal step인 tau는 제외하고 남은 input/output event의 sequence를 trace로 정의한다. 이 또한 관찰 대상에서 tau를 제외함에 따른 trace 정의라고 볼 수 있다.

관찰 대상을 고정하고 나면, 명세는 이렇게 정의된 trace의 집합으로 볼 수 있다. 명세가 반드시 실행 가능한 프로그램일 필요는 없다. 논리식, 입출력예제, reference interpreter 모두 어떤 trace가 허용되는지를 정하는 서로 다른 방법이다. 이 틀 안에서는 함수별 pre/postcondition 명세와 P4-SpecTec(이하 SpecTec)의 실행 가능한 명세를 같은 선상에 놓고 비교할 수 있게 된다.

#### Trace equivalence, Trace inclusion

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

#### 명세는 동작의 일부만 기술한다

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

#### SpecTec명세는 어떤 명세인가

이제 네 가지 축을 토대로 P4-SpecTec으로 작성된 명세의 성격을 더 정확히 설명할 수 있다. Observation 축에서는 현재 meta-interpreter가 반환한 최종 결과를 실제 구현체의 결과와 비교하므로, observable outcome은 이 결과값 하나(길이 1의 trace)라고 볼 수 있다. Trace space 축에서는 rule끼리 전부 disjoint하다면 완전히 deterministic한 명세다. Input space 축에서는, 마찬가지로 rule이 total하냐에 달려있다. 마지막으로 model complexity 축에서는 실제 P4 구현에 들어가는 최적화나 복잡한 데이터 구조 없이 간결하게 작성한다는 점에서 구현보다 단순하다. Mike가 말한 simpler implementation과 가장 직접적으로 대응되는 예시라고 볼 수 있다.

따라서 SpecTec 명세는 실제 구현의 최종 결과와 직접 비교할 수 있는 executable oracle로 작용한다. 각 relation의 조건이 disjoint하고 exhaustive하며 termination이 보장된다면, 모든 입력에 대해 결과가 하나로 정해지는 완벽한 oracle로 작용한다.

서로 다른 구현의 동작을 허용하고 싶다면, 어느 축에서 그 차이를 처리할지 결정해야 한다. 비교할 필요가 없는 차이를 observation에서 제외하는 것이 현재 방식이다. Architecture나 environment에 따라 결과가 달라지는 경우에는 이를 명세 입력의 parameter로 모델링할 수 있다. 같은 observation과 input에서도 여러 결과를 모두 허용해야 한다면 trace space 자체를 넓혀야 한다. 현재 명세 언어는 choice나 constraint solving을 지원하지 않고, meta-interpreter는 first match만 실행한다. 따라서 rule의 조건을 겹치게 작성하더라도 trace space가 넓어지지 않으며, 여러 trace를 표현하는 것은 현재로서는 불가능하다.

#### 검증 명세와 SpecTec 명세의 (생각보다 중요한) 마지막 차이

앞에서 살펴본 명세는 프로그램을 함수 단위로 나누고 각 함수에 pre/post condition을 부여한다. 그리고 프로그램 전체의 검증은 각 함수 사이의 contract를 조합하여 이루어진다.

현재 SpecTec 명세는 이런 방식으로 나뉘어 있지 않다. 비교하는 대상은 정해진 몇 개의 entrypoint (typecheck, instantiate, evaluate)에 대한 전체 실행결과 뿐이다. 또한 SpecTec의 함수와 relation은 여러 개의 rule로 정의되어 있지만 공통의 pre/postcondition은 정의하지 않는다. 즉 각 함수의 구현을 감추거나, caller가 사용할 수 있는 contract를 제공하지는 않는다. 이 차이로 인해, 현재 구조 그대로 증명에 활용하려면 전체 실행 사이의 simulation이나 refinement를 보이는 것이 자연스럽다. 반대로 modular한 증명을 필요로 한다면 각 함수 단위에서 contract를 정의할 필요가 있다.

#### 앞으로의 질문

SpecTec 명세와 검증을 연결하는 한 가지 방법은 전체 프로그램 수준에서 SpecTec과 실제 구현의 equivalence나 refinement를 증명하는 것이다. 그러나 SpecTec 명세가 허용하는 trace space가 아주 좁은 편이기 때문에 refinement 증명의 난이도가 굉장히 높을 것으로 예상된다.

다른 방법은 현재의 executable semantics를 유지하면서 semantic function과 relation에 대해 modular하게 사용할 수 있는 contract를 별도로 제공하여 증명하는 것이다. 이 contract는 SpecTec의 rule을 대체하지 않고, 여러 rule이 공통으로 보장하는 property를 요약해야 할 것이다. 이후 증명에서는 이 property를 사용하여 modular한 증명이 가능하다.

처음의 질문은 검증 명세와 SpecTec 명세가 같은 종류의 명세인지에 관한 것이었다. 지금까지의 결론은 observation, trace space, input space, model complexity뿐 아니라 명세의 단위와 composition 방식에서도 다르다는 것이다. 현재 SpecTec은 전체 프로그램의 의도된 결과를 계산하는 데 초점을 두고 있으며, 함수 단위의 modular interface는 명시되어 있지 않다. Type soundness 증명의 경우에는 well-typed인 전체 프로그램 실행을 비교하여 표현이 가능하지만, 같은 명세를 보다 다양한 증명에 활용하고 싶다면 modular contract가 있어야 할 것 같다는 것이 현재 도달한 결론이다.

### 내 연구 설명하기

이틀차, 교수님께 미션을 받았다. 여름학교 기간동안 학생들에게 내 연구를 설명하는 연습을 할 것. Camera-Ready를 제출한 직후고 10월에 ASE에서 발표도 해야 하기 때문에, 도망칠 명분은 없었다. 내가 가장 불편해하는 것에 부딪힐 때가 온 것이다. 관심 없어 보이는 학생에게 연구 독백을 하는 것은 정말 고통스러웠지만, 고맙게도 시간이 흐를수록 학생들도 서로 긴장이 풀려 먼저 연구주제를 물어봐주는 경우가 많았다. 너무 짧게 설명하기도 하고, 쓸데없이 자세히 설명하기도 하고, 잘못 설명하기도 하고, 삼천포로 빠지기도 했다. 하지만 그 과정에서 나의 이해가 성장했음을 체감할 수 있었다. 또 내 연구에 관심 가져주는 사람이 많으니 연구에 대한 애정도 조금 더 생겼다.

현재 상태를 기록하기 위해 논문의 핵심을 아주 짧게 요약하면 이렇다.

> 이더리움 명세는 파이썬 명세로 되어있으며, 이 명세는 integer overflow, underflow, array out-of-bounds, division by zero등의 implicit exception에 상당 부분 의존한다. 이에 더해 branch fallthrough logic을 많이 활용하여, 오류를 일으키는 조건을 나열하기 어렵다. 이런 조건에서 구현체 간 불일치가 일어나며, 공식 테스트도 해당 조건을 놓쳐 여태까지 발견되지 않았다. 우리 연구에서는 implicit exception을 explicit condition으로 만들고, branch condition을 전부 disjoint하고 complete하게 만들어 오류 조건을 나열하기 쉽게 만들었다. 이에 따라 더 상세한 커버리지를 측정할 수 있고 테스트 생성으로 불일치를 27건 새로 발견했으며 그 중 22건이 원래 명세에서는 implicit exception에 의존하던 조건에 해당한다.

체감할 수 있었던 또 다른 이유는, 이더리움 후속 연구에서 하고 싶은 것이 구체화되었기 때문이다. 내가 뭘 했는지가 명확하니 다음 연구를 더 잘하는 방법도 같이 명확해졌다. 현재 implicit exception을 explicit하게 만드는 과정은 완전히 manual하며, branch condition끼리 disjoint하고 complete한지 확인하는 것은 인간의 검토와 테스팅에 의존한다. 이는 Capella버전의 명세가 크기가 작기 때문에 가능했던 일인데, Gloas 규모의 명세에 적용하려면 scalability와 robustness를 개선하는 과정이 반드시 필요하다. 이를 가장 먼저 시도해보려고 한다.

### Mini-ML in SpecTecX

Jean-Christophe 교수님께서 수업에서 가르치는 Mini-ML이라는 언어를 SpecTec으로 써보고 싶다고 하셨다. OCaml 코딩을 사랑하시고 여러 라이브러리를 만들어보셔서 아주 좋은 피드백을 많이 받을 수 있었다.

실은 SpecTec을 보고 교육에 관심을 보인 분은 벌써 세번째다. 작년 OOPSLA에서 재현이의 HATRA 발표를 들은 최광훈 교수님께서 수업에서 쓸 생각은 없냐고 물어보셨다. Eth-SpecTec을 막 시작하던 시기인데, “언젠가 해봐야지”라는 생각이 SpecTecX와 Eth-SpecTec을 따로 만들고 유지하는 데에 영향을 줬던 것 같다. 그리고 올해 PLDI Tutorial에서 Sanjiv Prasad 교수님, 이번에 Jean-Christophe 교수님까지 세 번째가 되었고, 이제는 해볼 수 있는 상태가 됐다.

덕분에 SpecTecX를 앞으로 어떻게 활용할지도 정리가 됐다. 맨 처음 SpecTecX의 역할은 내가 SpecTec의 구조를 이해하기 위함, 그리고 P4-SpecTec과 Eth-SpecTec 사이 징검다리를 남겨놓기 위함이었다. 이해는 충분히 했고, LLM이 포팅을 매우 잘 하기 때문에 징검다리의 존재의의도 희박해졌다. Tutorial을 목표로 잠시 또 달렸으나 이제는 존재 목적이 애매해졌고, 아이디어는 많은데 우선순위 정리가 안 되고 있었다. 또 아이디어마다 P4-SpecTec, SpecTecX, Eth-SpecTec 중 어디에 어떤 순서로 넣어야 할지 판단 기준이 없었다.

지금은 “P4-SpecTec의 Demo 및 교육용 subset”으로 SpecTecX의 역할을 당분간 고정해 두고 이 목적에 부합하는 부분부터 개선해 나가려고 한다. 재현이가 만든 P4-SpecTec의 정체성을 해치지 않으면서, 각 repo에서 우선순위가 무엇인지 너무나도 명확해졌다.

### 마치며

나는 꿈을 꾸는 사람이다. 그래서 연구를 할 때도, 이 다음과 그 다음과 또 그 다음까지 상상의 나래를 펼치며 연구를 해왔다. 동기부여 측면에서는 좋고, 내가 스타트업 대표거나 제품을 영업하는 사람이라면 도움이 될 거라고 생각한다. 하지만 연구를 할 때는 눈 앞에 있는 문제에 조금 더 끈질기고 꼼꼼하게 집중하는 것이 중요하다는 것을 배웠다.
Marktoberdorf 2026에서 나와 대화를 나눠준 모든 학생과 강사진, 함께 가서 많은 의지가 되어준 재현이와 항상 아낌없이 도와주시는 교수님께 감사의 인사를 드리며 글을 마친다.
