---
theme: hossam
title: 파이썬 기초 · 3. 변수와 자료형
layout: cover
---

<!--
hossam 테마 예제 덱. title 의 " · " 앞은 사이드바 위 과정 이름, 뒤는 단원 이름이 된다.
슬라이드의 첫 제목이 왼쪽 목차에 올라가고, ### 제목 슬라이드는 한 단계 들여쓴다.
컴포넌트: Callout(kind: eli5·real·tip·warn·danger·ai) · Prompt(4개 백틱 text 펜스) · Output · Steps(color: py·ai·ok)
클래스: .card(.py .ai .ok) · .kicker(.ai .lab) · .muted · .small · 표지의 .sub
-->

# 변수와 자료형

값에 이름을 붙여 두고 다시 쓰는 방법

<p class="sub">파이썬 기초 과정 · 3강</p>

---

## 변수란 — 값에 붙이는 이름표

- 변수는 값을 담는 **이름표**다. `=` 로 값을 넣는다
- 이름은 뜻이 드러나게 짓는다: `age`, `user_name`

```python
age = 20          # 정수
name = "하늘"     # 문자열
print(name, age)
```

<Callout kind="eli5">
상자에 이름표를 붙여 두면, 나중에 상자를 열지 않아도 이름만으로 찾을 수 있다.
</Callout>

---

## 자료형 네 가지

| 자료형 | 예 | 설명 |
|---|---|---|
| int | `3`, `-10` | 정수 |
| float | `3.14` | 소수 |
| str | `"안녕"` | 글자 |
| bool | `True`, `False` | 참 / 거짓 |

<Callout kind="tip">

`type(값)` 으로 자료형을 바로 확인할 수 있다.

</Callout>

<Callout kind="warn" title="자주 틀리는 것">

`"3" + 4` 는 오류다. 글자와 숫자는 더할 수 없다.

</Callout>

---
layout: two-cols
---

## 실습 — 자기소개 출력

<Steps>
<li>이름과 나이를 변수에 넣는다</li>
<li>f-문자열로 한 줄을 만든다</li>
<li><code>print()</code> 로 출력한다</li>
</Steps>

<div class="card ok">
<h3>확인</h3>
<p>출력 결과가 오른쪽과 같으면 성공</p>
</div>

::right::

```python
name = "하늘"
age = 20
print(f"{name}님은 {age}살")
```

<Output>
하늘님은 20살
</Output>

---

## AI와 함께 — 오늘의 프롬프트

<Prompt>

````text
변수 이름을 지을 때 지켜야 할 규칙 3가지를
초등학생도 이해할 수 있게 예시와 함께 설명해 줘.
````

</Prompt>

<Callout kind="ai">
답을 그대로 믿지 말고, 규칙 하나를 골라 직접 코드로 확인해 본다.
</Callout>

<Callout kind="danger">
이름, 전화번호, 계정 같은 개인정보는 프롬프트에 넣지 않는다.
</Callout>

---

### 더 알아보기 — 형 변환

<span class="kicker lab">정리</span>

<div class="card py">
<h3>int("12") → 12</h3>
<p>문자열을 정수로 바꾼다. 숫자가 아닌 글자가 섞이면 오류가 난다.</p>
</div>

- `int()`, `float()`, `str()` 로 서로 바꿀 수 있다
- <span class="muted">다음 시간: 조건문</span>
