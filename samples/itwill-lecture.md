---
theme: jussam
title: AI가 일하는 시대, 개발자로 산다는 것
titleTemplate: '%s · 아이티윌 특강 2026.07.27'
layout: cover
eyebrow: itwill special lecture · 2026.07.27
footer: 아이티윌 / 2026년 7월 27일
---

<!--
jussam 테마 샘플 덱. 2026-07-27 아이티윌 특강 "AI가 일하는 시대, 개발자로 산다는 것".
레이아웃: cover(표지·마무리, eyebrow·footer·mesh) · section(파트 표지, part: 1~4) · default(본문, eyebrow·part·source)
제목의 **굵게** 는 그라디언트 강조. 컴포넌트(themes/jussam/components):
  Grid Card Stat Kicker Note Spacer Hero · Agenda/NumList + Item · BeforeAfter + Side
  Timeline Gauge Slope Funnel Branch HBar Meter Bars Mul Formula
컴포넌트 안에 마크다운(굵게·목록)을 쓰려면 여는 태그와 닫는 태그 앞뒤를 빈 줄로 띄운다.
굵게 바로 뒤에 조사가 붙으면(**46%**가) 마크다운이 닫지 못하므로 그런 곳만 <b>…</b> 를 쓴다.
긴 데이터(Timeline·Bars)는 슬라이드 프런트매터(YAML)에 두고 v-bind="$frontmatter.이름" 으로 넘긴다 (태그를 여러 줄로 쪼개면 문단으로 잡힌다).
-->

# AI가 일하는 시대,<br>**개발자로 산다는 것**

IT 기술 동향과 취업시장이 요구하는 역량

---
layout: cover
mesh: soft
eyebrow: hook
source: acmicpc.net 공지 (2026년 7월 확인)
---

<Hero n="16" unit="년" caption="2010년 개설 → 2026년 4월 28일">

## 백준, 16년 만의 서비스 종료

한국 개발자 지망생의 코딩테스트 준비를 상징하던 사이트<br>지금 acmicpc.net에는 서비스 종료 안내와 "곧 다시 돌아오겠다"는 공지만 남은 상태

</Hero>

<Spacer />

### 왜 하필 지금이었을까

---
eyebrow: agenda
---

# 오늘의 여정

<Agenda>
<Item part="1" title="글로벌 AI 동향">모델 경쟁, AI 코딩 도구, 에이전틱 AI</Item>
<Item part="2" title="국내 기업 동향">네이버 · 카카오 · LG · 삼성, 그리고 소버린 AI</Item>
<Item part="3" title="알고리즘, 실무와 채용">서비스 속 알고리즘과 흔들리는 코딩테스트</Item>
<Item part="4" title="요구되는 역량">숫자로 본 신입 시장과 오늘부터 할 일</Item>
</Agenda>

---
layout: section
part: 1
---

# 글로벌 AI 동향

모델 경쟁, 코딩 도구, 그리고 에이전트

---
part: 1
eyebrow: frontier models
source: tech-insider, neuralcoretech
timeline:
  start: 2026-02-01
  end: 2026-08-01
  events:
    - date: 2026.02.19
      name: Gemini 3.1 Pro
      org: google deepmind
      desc: 텍스트 · 이미지 · 영상 · 오디오 · 코드까지<br>아우르는 100만 토큰 컨텍스트
    - date: 2026.04.23
      name: GPT-5.5
      org: openai
      desc: 12일 뒤인 5월 5일<br>ChatGPT 기본 모델로 승격
    - date: 2026.07.24
      name: Claude Opus 5
      org: anthropic
      desc: Artificial Analysis 기준<br>Intelligence 61점 · Agentic 55.3점으로<br>전 모델 1위
      hl: true
---

# 여섯 달 사이, **최전선 세 번 교체**

<Timeline v-bind="$frontmatter.timeline" />

<Kicker style="margin-top:8px">맨 오른쪽은 사흘 전</Kicker>

---
part: 1
eyebrow: ai coding tools
source: pasqualepillitteri, sitepoint
---

# AI 코딩 도구는 **이미 표준**

<Grid cols="330px 1fr">
<Gauge :value="84" label="개발자 일상 사용" note="쓰느냐 마느냐의 논의는 종료" />
<Slope k="claude code adoption" t="9개월 만에 여섯 배" :from="['2025.04', 3]" :to="['2026.01', 18]" :max="20" />
</Grid>

<Grid cols="3" style="margin-top:18px">
<Card sm>

시장 규모 18개월 만에 **두 배**<br>2024년 51억 달러 → 2026년 약 128억 달러

</Card>
<Card sm>

경력 10년 이상 시니어의 <b>46%</b>가 Claude Code 선택<br>숙련자일수록 사용률 상승

</Card>
<Card sm>

GitHub Copilot은 기업 채택률 <b>29%</b>로 1위<br>다만 성장은 정체 구간

</Card>
</Grid>

---
part: 1
eyebrow: agentic ai
source: digitalapplied, salesmate
---

# 도구에서 **동료로**

AI가 개인 비서에서 워크플로 파트너로 넘어가는 해가 2026년

<Grid cols="3">
<Stat n="80" unit="%" label="엔터프라이즈 앱의 AI 에이전트 내장 비율" :fill="80" :mark="33">2026년 1분기 출시 · 업데이트 기준<br>눈금 표시는 2024년 33% 지점</Stat>
<Stat n="31" unit="%" label="프로덕션에서 에이전트를 운영 중인 기업" :fill="31">금융 · 보험 47%로 선두,<br>헬스케어 · 정부 14~18%로 후미</Stat>
<Stat n="5.1" unit="개월" label="에이전트 배포 평균 손익분기" :fill="42.5" scale="12개월">실험 단계가 아니라<br>투자 회수가 계산되는 단계</Stat>
</Grid>

<Kicker lead>프로덕션 배포 중 22%는 이미 에이전트 세 개 이상을 조율하는 멀티에이전트 구조</Kicker>

---
layout: section
part: 2
---

# 국내 기업은 지금

여러분이 지원할 회사들의 이야기

---
part: 2
eyebrow: domestic · big 4
source: 전자신문, 카카오, 인사이트코리아, 삼성전자 뉴스룸
---

# 네 회사, **같은 방향**

<Grid cols="2" gap="18">
<Card acc k="naver" t="하이퍼클로바X 신규 라인업">2026년 상반기 엔비디아 블랙웰 B200 약 4,000장 규모의 내부 학습 클러스터 구축<br>하반기 신모델은 40% 작은 크기에 유사 성능, 운영비 절반 이상 절감 목표</Card>
<Card acc k="kakao" t="카나나가 다음 검색을 대체">2026년 4월 21일부터 카카오톡 안의 다음 검색을 AI 에이전트 카나나로 순차 대체 중<br>국민 메신저의 검색 진입점 자체가 에이전트로 전환</Card>
<Card acc k="lg ai research" t="엑사원 4.5와 산업 응용">서울 코엑스 ICML 2026에서 33B 규모 VLM 엑사원 4.5 공개<br>신소재, 금융 에이전트, 데이터 파운드리로 이어지는 산업 응용 라인 동시 발표</Card>
<Card acc k="samsung" t="가우스2와 3세대 AI폰">사내 생성형 AI 가우스2를 콤팩트 · 밸런스드 · 슈프림 3종으로 운영 중<br>2026년 갤럭시 언팩에서 3세대 AI폰 갤럭시 S26 시리즈 공개</Card>
</Grid>

<Kicker>자체 모델과 에이전트, 네 회사 동시 추진</Kicker>

---
part: 2
eyebrow: telco · sovereign ai
source: SK텔레콤 뉴스룸, 과기정통부 정책브리핑, AI타임스 / 예산 · GPU 규모는 발표 시점에 따라 달라질 수 있는 근사치
---

# 통신사도 정부도 **같은 판 위**

<Grid cols="2">
<Card lg acc k="telecom" t="통신 3사의 에이전트 전면 경쟁">

SKT · 에이닷 기능 강화, MWC26에서 풀스택 AI 전략 제시

KT · K-PATH 2026 오픈이노베이션으로 외부 파트너 확보

3사 공통 · 요금제 경쟁이 아니라 에이전트 경쟁으로 전선 이동

</Card>
<Card lg acc k="sovereign ai" t="국가대표 AI, 그리고 컴퓨팅 인프라">

독자 파운데이션 모델 · 국가대표 AI 사업, 2027년까지 약 5,300억 원 규모

GPU · 2025년 1차로 1만 3천 장 확보, 2028년까지 5만 2천 장 이상 확대 로드맵

목표 · 글로벌 모델 성능의 95% 이상

</Card>
</Grid>

---
part: 2
eyebrow: so what
---

# 지원할 회사들이 **전부 AI 회사로**

<NumList>
<Item title="채용 공고의 직무 설명 변화">같은 백엔드 개발자 공고라도 요구 기술 목록에 LLM 연동, 벡터 검색, 에이전트 워크플로가 추가되는 중</Item>
<Item title="면접 질문의 축 이동">무엇을 아느냐보다, AI가 낸 결과를 어떻게 검증했느냐가 질문의 중심</Item>
<Item title="포트폴리오 평가 기준 변화">완성된 화면이 아니라 문제를 정의하고 판단한 흔적이 평가 대상</Item>
</NumList>

<Kicker muted>AI 회사에 지원하는 게 아니라, 어디에 지원해도 AI 이야기</Kicker>

---
layout: section
part: 3
---

# 알고리즘, 실무와 채용

쓰이는 곳과 평가되는 곳의 간극

---
part: 3
eyebrow: algorithms in production
source: 카카오 기술블로그, 토스 기술블로그
---

# 매일 쓰는 **서비스의 속**

<Grid cols="1fr 400px" gap="44" align="start">
<Funnel title="토스 쇼핑 추천 · 멀티스테이지 구조" :rows="[['후보 전체', '수백만', 100], ['1차 후보 생성', '수천', 76], ['랭킹 · 재정렬', '수십', 52], ['노출', '1화면', 30]]" note="폭은 단계 축소를 보여주는 도식이며 실제 비율과 무관" />
<Grid cols="1" gap="16">
<Card sm k="kakao" t="토픽 모델링과 MAB">추천에 Multi-Armed Bandit 결합<br>탐색과 활용의 균형을 실시간 조정</Card>
<Card sm k="delivery" t="배차 매칭과 요금 산정">주문과 라이더의 매칭, 요금 민감도 조정 모두 최적화 문제<br>공개 자료가 제한적이라 업계 정리 수준</Card>
</Grid>
</Grid>

<Kicker style="margin-top:26px">전부 자료구조와 복잡도를 아는 사람의 설계</Kicker>

---
part: 3
eyebrow: algorithms in hiring
source: 코드트리, 카카오 기술블로그
---

# 코딩테스트는 **여전히 유효**

<Grid cols="2">
<Card lg acc k="samsung" t="SW역량테스트, 2026년에도 유지">3월 서류 → 4월 코딩테스트 → 5월 면접 → 6월 발표, 일정 그대로 진행<br>화려한 알고리즘보다 조건 해석과 구현 정확도 중시 경향 지속</Card>
<Card lg acc k="kakao" t="블라인드 채용, 2026년에도 유지">신입 크루 공채 코딩테스트 진행 후 문제 해설을 기술블로그에 공개<br>어떤 사고 과정을 기대하는지 회사가 직접 공개하는 셈</Card>
</Grid>

<Card sm style="margin-top:20px">국내 온라인 저지 · 코딩테스트 플랫폼은 프로그래머스를 비롯해 계속 운영 중<br>연습할 곳 자체가 사라지지는 않은 상태</Card>

---
part: 3
eyebrow: the shift
source: 언론 보도 종합, 코드트리
---

# 한 판으로 거르던 방식의 **균열**

생성형 AI로 코드 작성의 진입장벽이 낮아지면서,<br>알고리즘 문제풀이 중심 평가의 실효성 논쟁 확대

<Branch src="코딩테스트 한 판">
<Card k="01" t="과제형 평가">며칠간 실제 요구사항을 구현하게 하고<br>설계 선택과 트레이드오프 관찰</Card>
<Card k="02" t="코드 리뷰">남이 쓴 코드, 혹은 AI가 쓴 코드를 읽고<br>문제를 짚어내는 능력 확인</Card>
<Card k="03" t="AI 활용 능력">도구 사용 금지가 아니라,<br>어떻게 쓰는지를 평가 항목으로 편입</Card>
</Branch>

---
part: 3
eyebrow: part 03 · wrap-up
---

# 알고리즘 공부의 **목적 전환**

<BeforeAfter>
<Side from k="before" v="통과용">문제 유형을 외워 시험에서 맞히기 위한 공부<br>합격하는 순간 효용 종료</Side>
<Side to k="after" v="설계 기본기">AI가 내놓은 코드가 왜 느린지, 어디서 터질지 판단하는 근거<br>일하는 내내 사용</Side>
</BeforeAfter>

<Kicker lead>AI는 정답 코드를 빠르게 생성<br>그 코드가 맞는지 판단하는 일은 여전히 사람의 몫이고, 그 판단의 언어가 알고리즘과 복잡도</Kicker>

---
layout: section
part: 4
---

# 취업시장이<br>요구하는 역량

숫자를 먼저 보고, 할 일을 정하기

---
part: 4
eyebrow: hiring outlook 2026
source: platum, 뉴욕 연방준비은행, Stanford Digital Economy Lab
---

# 열린 채용, **좁은 신입 자리**

<Grid cols="3" gap="16" style="margin-bottom:30px">
<Stat sm n="44.4" unit="%" label="채용 유지" />
<Stat sm n="30.1" unit="%" label="채용 확대" />
<Stat sm n="25.5" unit="%" label="채용 축소" />
</Grid>

<HBar title="2026년 채용 계획 중 경력 구간별 비중 · 단위 %" :rows="[['신입', 12.4, true], ['경력 4~7년', 49.7]]" :max="60" />

<Kicker style="margin-top:36px">문은 열려 있지만, 신입에게 열린 문은 아직</Kicker>

<Note>참고 · 미국 컴퓨터공학 전공 졸업생 실업률 7.5%로 전체 평균 4.3%를 상회<br>22~25세 개발자 고용은 챗GPT 출시 시점인 2022년 말 대비 약 20% 감소 (Stanford Digital Economy Lab 분석)</Note>

---
part: 4
eyebrow: naver vs kakao · new grad hiring
source: 이투데이, 카카오 / 네이버 2023년 공채 인원은 이번 자료에 없어 표기 생략
bars:
  labels: ['2023', '2024', '2025']
  max: 500
  unit: 명
  groups:
    - name: 네이버
      legend: 네이버 신입 공채
      values: [null, 258, 396]
      foot: 2024년 대비 2025년 53.5% 증가
    - name: 카카오
      legend: 카카오 신입 공채
      values: [452, 314, 292]
      foot: 2년 연속 감소
---

# 사라지는 게 아니라, **갈리는 중**

<Bars v-bind="$frontmatter.bars" />

<Kicker lead style="margin-top:28px; font-size:18px">2026년에는 양사 모두 정기 공채 대신 프로젝트형 인턴십과 수시채용으로 전환 검토 중</Kicker>

---
part: 4
eyebrow: job postings
source: speak
---

# 먼저 바뀐 것은 **공고**

<Grid cols="1.15fr .85fr" gap="52" align="start">
<Grid cols="1" gap="24" title="AI 역량을 명시한 채용 공고 비중 · 2026년 3월 기준">
<Meter label="인턴 공고" value="10.3%" :fill="10.3" scale="전체 공고 100%" foot="1년 전 대비 약 2배" />
<Meter label="정규직 공고" value="4.2%" :fill="4.2" scale="전체 공고 100%" foot="1년 전 대비 약 2배" />
</Grid>
<Card lg acc k="skills-based hiring" t="스펙보다 증명">

아직 절대 비중은 작지만 방향은 분명<br>학교 · 학점 · 자격증 목록 대신<br>프로젝트 경험과 실제 결과물을 요구하는<br>스킬 기반 채용 증가

지금 준비하는 사람에게는 아직 늦지 않은 타이밍이라는 의미

</Card>
</Grid>

---
part: 4
eyebrow: role shift
source: 코드트리
---

# 역할의 **한 칸 이동**

<BeforeAfter>
<Side from k="before" v="코드 작성자">요구사항을 받아 문법에 맞는 코드로 옮기는 일<br>속도와 정확도가 경쟁력이던 시기</Side>
<Side to k="after" v="검증하고 설계하는 사람">AI 산출물을 읽고 판단하며 무엇을 만들지 정하는 일<br>문제 정의와 검증이 경쟁력</Side>
</BeforeAfter>

<Kicker lead>평가축도 동반 이동<br>코딩테스트 점수 하나가 아니라 AI 도구 활용 능력과 문제 해결 기여도를 함께 확인</Kicker>

---
part: 4
eyebrow: competency frame
---

# 세 축은 **덧셈이 아니라 곱셈**

<Mul>
<Card lg acc k="axis 01" t="기본기">CS 지식, 자료구조, 알고리즘,<br>네트워크와 데이터베이스<br>AI 산출물 판단의 기준선</Card>
<Card lg acc k="axis 02" t="AI 도구 활용">코딩 에이전트로 실제 결과물을 만들어 본 경험<br>어디까지 맡기고 어디부터 직접 볼지 아는 감각</Card>
<Card lg acc k="axis 03" t="증명 가능한 프로젝트">남에게 보여줄 수 있는 저장소, 배포된 서비스,<br>판단 근거를 남긴 기록</Card>
</Mul>

<Formula :tokens="['기본기', '×', 'AI 도구 활용', '×', '0', '=', '0']" note="하나라도 0이면 결과도 0" />

---
part: 4
eyebrow: action plan
---

# 오늘부터 할 **다섯 가지**

<NumList>
<Item title="AI 코딩 에이전트로 매주 하나씩 만들고 기록 남기기">완성도보다 빈도<br>커밋 히스토리 자체가 증거</Item>
<Item title="AI가 쓴 코드를 리뷰하는 연습">왜 이 구조인지, 어디가 위험한지 말로 설명할 수 있으면 면접에서 그대로 사용 가능</Item>
<Item title="알고리즘은 통과용이 아니라 설계 근거로 학습">푼 문제의 시간복잡도를 소리 내어 설명해 보는 것부터 시작</Item>
<Item title="관심 도메인 하나를 정하고 그 도메인의 실제 문제 선택">튜토리얼을 따라 만든 쇼핑몰보다, 내가 불편했던 문제 하나가 더 강력</Item>
<Item title="결과물 공개">저장소, 배포 링크, 짧은 회고 글 세 가지를 한 세트로 준비</Item>
</NumList>

---
part: 4
eyebrow: faq 01 · portfolio
---

# 포트폴리오, **개수보다 서사**

<BeforeAfter>
<Side from k="흔한 실수" v="개수 채우기">

- 클론코딩 프로젝트 N개 나열
- 완성 화면 캡처와 기능 목록만
- AI로 만든 티를 지우려는 시도

</Side>
<Side to k="통하는 구성" v="판단이 보이는 한둘">

- 문제 정의가 드러나는 프로젝트 하나둘
- 기술 선택의 이유와 트레이드오프 기록
- AI 활용 과정과 검증 절차를 그대로 문서화

</Side>
</BeforeAfter>

<Kicker>코드는 AI도 쓴다, 평가자가 보는 것은 판단의 흔적</Kicker>

---
part: 4
eyebrow: faq 02 · certificates
---

# 자격증, **목적지에 따라 다른 무게**

<Grid cols="2">
<Card lg acc k="track a · 공공 · 금융 · si" t="지원 요건으로 실재">정보처리기사 등이 가산점 또는 지원 자격으로<br>채용 공고에 명시되는 경우 다수<br>서류 단계에서 정량 점수로 환산되기도 하는 구조</Card>
<Card lg acc k="track b · 서비스 기업 · 스타트업" t="증명물 중심 평가">자격증을 요구하는 공고 자체가 드문 편<br>프로젝트와 코드, 배포된 결과물이 평가의 중심<br>같은 시간이면 결과물 쪽이 더 큰 신호</Card>
</Grid>

<Card sm style="margin-top:20px">데이터 직무의 SQLD · ADsP · 빅데이터분석기사는 합격증 자체보다 학습 로드맵으로서의 가치가 큰 편<br>범위가 정해져 있어 기초를 한 바퀴 훑는 순서표로 활용 가능</Card>

<Kicker>자격증은 문을 여는 최소 조건, 포트폴리오는 문 안에서 쓰는 무기</Kicker>

---
part: 4
eyebrow: faq 03 · graduate school
---

# 대학원, **도피가 아니라 전략일 때**

<Grid cols="3">
<Card acc k="전략" t="학위가 요건인 목표">ML 리서처처럼 논문과 학위가<br>지원 요건에 들어가는 포지션이 목표<br>파고들 도메인이 이미 명확한 상태</Card>
<Card dim k="위험 신호" t="일단 진학하는 선택">취업이 안 되니 시간을 벌자는 판단<br>2년 뒤 시장은 더 AI 중심이고<br>실무 경험 공백은 그대로 잔존</Card>
<Card acc k="판단 기준" t="공고로 확인">가고 싶은 회사와 직무의 공고에서<br>학위 요건을 직접 확인<br>공고가 가장 정직한 답</Card>
</Grid>

<Kicker>학위는 방향이 정해진 사람에게 가속, 방향을 찾는 수단으로는 비싼 선택</Kicker>

---
layout: cover
mesh: soft
eyebrow: closing
---

## 이 슬라이드도 AI 코딩 에이전트와 함께

리서치 정리, 구조 설계, 화면 코드 작성까지 함께 진행<br>사람의 몫은 무엇을 말할지 정하는 일과, 나온 결과의 검증

<Spacer />

### **AI가 코드를 쓰는 시대에 남는 자리는,<br>무엇을 만들지 정하고 그 결과를 책임지는 자리**

---
layout: cover
eyebrow: q & a
---

# **질문 시간**

Q&A
