---
title: 조사 공백 메우기 — 금융사 3곳 재시도 · 미열람 업체 4곳 · 재확인 3건 · 상충 4건
date: 2026-09-15
type: research
ticket: "#29"
sources:
  - https://www.mgcap.co.kr/ (MG캐피탈 — /mgcap/finance/WCF20100VQ.jsp 자동차 신차 운용리스, /jsp/customer/WCC20100VQ.jsp)
  - https://capital.miraeasset.com/ib20/mnu/BCWCOMM000020 (미래에셋캐피탈 메인), /ib20/mnu/BCWAMFC050000 (자동차금융(종료))
  - https://www.kcarcapital.com/ (K카캐피탈=케이카캐피탈)
  - https://sggo.kr/notice (승계고 공지 목록)
  - https://www.imcap.co.kr/automobile/sucsCnslCar.do , https://www.imcap.co.kr/customer/myCarSucsGuide.do (iM캐피탈)
  - https://fem.encar.com/cars/detail/42721599 (엔카 리스 매물, 현대캐피탈 직판)
  - https://carding.co.kr/terms , /product , /guide/safe-direct-trade , /notice (카딩)
  - https://dealndeal.co.kr/ , https://dealndeal.co.kr/faq (딜앤딜)
  - https://www.woorifcapital.com/popup/loan/counsel/TESLALoan.do , /financingmall/goods.do?webGdCd=HS_AT01 , ?webGdCd=HS-RC03 (우리금융캐피탈)
  - http://www.jyat.co.kr/ , /15 , /26 , /22/?idx=47 (리렌트레이드/제이와이오토)
  - https://web.getcha.kr/ , /promotion/business-only (겟차)
  - https://infinitycar.kr/ , /community/faq.php , /company/service.php , /company/about.php (인피니티카)
  - https://xn--oy2b27nt4dn5r.com/ (헤이리스, 헤이리스.com) , /?m=counsel&s=lease , /?m=sale&s=list&carnation=1
cache:
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/mgcap-root.html, mg-f100.html, mg-f106.html, mg-f108.html, mg-c60100.html, mg-c20100.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/miraeasset-root.html, miraeasset-mnu.html, miraeasset-autofin.html, miraeasset-ars.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/kcar-root.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/sggo-notice.html, sggo-notice-raw.html, sggo-full.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/im-sucsCnslCar.md, im-myCarSucsGuide.md
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/encar-42721599.md
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/carding-terms.md, carding-product.md, carding-guide-safe.md
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/dealndeal-home.md, dealndeal-faq.md, dealndeal-raw.html, dealndeal-faq-raw.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/woori-at01.md, woori-rc03.md, woori-jeep.md, woori-peugeot.md, woori-scsAplct.md
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/jyat-15.html
  - /Users/kiyeol/development/navid/cha-yong/.firecrawl/_bench-gaps/heylease-root.html, heylease-lease.html, heylease-list.html
related:
  - 2026-09-15-bench-finance.md (§5, §8, §10 — 금융사 3곳의 기존 접속 실패 기록)
  - 2026-09-15-competitor-landscape.md (§4 금융사 연락처, §5 미확인 목록 8·11)
  - 2026-09-15-bench-carding.md, 2026-09-15-bench-agency.md, 2026-09-15-bench-community.md, 2026-09-15-bench-tier2-platforms.md (상충 항목의 원 출처)
---

## 한 줄 결론

금융사 3곳은 **`www.` 서브도메인 지정 + UA 고정으로 접속 자체는 모두 뚫렸다.** 다만 수수료·연락처는 확보했어도 MG캐피탈의 절차 전용 페이지, 미래에셋캐피탈의 수수료 산식 본문은 각각 페이지 부재·로그인 장벽으로 웹 밖에 남았다. K카캐피탈은 "승계"가 아예 존재하지 않는 중고차 할부 전문사(케이카 계열)임을 확인해 항목 자체가 소멸했다. **재확인 3건은 전부 재현**됐고 엔카 건은 여신금융협회 심의필 유효기간(2027-05-21)까지 확인해 신뢰도를 높였다. **상충 4건은 1건만 닫혔다** — 우리금융캐피탈은 테슬라 제휴 상품(50만원)과 일반 상품(100만원)의 **상품 차이**였지 상충이 아니었다. 나머지 3건(카딩 1%/1.5%, 딜앤딜 165만원/상담안내, iM캐피탈 1개월/3개월)은 페이지에 시행일·개정일이 없거나 정황 근거가 약해 **웹 밖**으로 남긴다. 미열람 업체 4곳 중 **인피니티카는 1층**(카딩 안심대행형과 동일 구조, 누적 승계완료 5,346대), **겟차는 3층**(승계 매물 게시 기능 없음, 콘텐츠 마케팅뿐), **리렌트레이드는 3층**(신차 견적 비교가 본업, 승계 매물은 광고성 재고), **헤이리스는 2층**(단일 매매상사가 승계신청으로 재고를 채워 되파는 채널)으로 넷 다 계층을 하나씩 확정했다.

- 확인일은 모두 2026-09-15다.
- 표기: **[확인]** 1차 원문 / **[코드]** 업체 웹 소스에서 관찰 / **[2차]** 기사·DB / **[판단]** 이 문서의 해석 / **[미확인]**.

---

## 1. 금융사 3곳 재시도

이전 조사(`2026-09-15-bench-finance.md` §10)는 `mgcap.co.kr`(non-www), `capital.miraeasset.com`(root), `kcarcapital.com`(non-www)에 각 3회 실패했다. 이번엔 `www.` 서브도메인 지정과 UA 고정(`curl -A "Mozilla/5.0"`)으로 재시도했다.

| 항목 | 결과 | 출처 | 상태 |
|---|---|---|---|
| MG캐피탈 접속 | `mgcap.co.kr`는 301로 `www.mgcap.co.kr`로 리다이렉트되는데, 이전 조사는 리다이렉트를 따라가지 않아 실패로 기록된 것으로 보인다. `www.mgcap.co.kr`는 200 정상 응답(Last-Modified: 2026-03-12) | www.mgcap.co.kr | 해결 |
| MG캐피탈 법인명 | og:title "MG캐피탈", 프레임셋 주석·FALLBACK 변수에 "효성캐피탈" 잔존 — **구 효성캐피탈** 표기가 코드 레벨에서도 확인됨 | www.mgcap.co.kr (EUC-KR, 소스 주석) | 해결 |
| MG캐피탈 승계수수료 | 자동차 신차 운용리스(대상: 법인·개인사업자·개인, 기간 36~60개월) 상품 페이지: "승계수수료 미회수 원금 X 최고요율(2%) X (잔여기간 월수 / 리스기간 전체월수)". **최소·최대 캡 명시 없음** — `bench-finance.md` §8에 정리된 19곳 중 캡을 명시한 15곳(대부분 최소 20만~최대 200만원 사이)과 달리 MG캐피탈만 상한이 없는 순수 정률 구조다. Q34(빠른승계 정액 30만원) 비교 후보로 볼 때, 상한 없는 정률형은 정액형과 가장 멀리 있는 사례다 | mgcap.co.kr/mgcap/finance/WCF20100VQ.jsp | 해결 |
| MG캐피탈 연락처 | "MG캐피탈 본점 : 서울특별시 중구 남대문로... 1588-9688 고객상담센터(평일 09:00~18:00)" — `competitor-landscape.md` §4 제공값(대표 1588-9688)과 **일치** | www.mgcap.co.kr (푸터) | 해결 |
| MG캐피탈 승계 절차 전용 페이지 | 상품 페이지에 산식만 있고 온라인 신청·서류·자격조건을 담은 절차 전용 페이지를 찾지 못함 | — | 웹 밖 |
| 미래에셋캐피탈 접속 | `capital.miraeasset.com` 루트가 200 반환. JS 리다이렉트(`/ib20/mnu/BCWCOMM000020`)를 직접 따라가면 메뉴 셸이 렌더됨(SPA, 본문은 AJAX) | capital.miraeasset.com | 해결 |
| 미래에셋캐피탈 자동차금융 사업 상태 | 개인금융 메뉴에 **"자동차금융(종료)"**로 표기 — 신규 취급이 종료된 상태. 그런데 같은 메뉴 트리 안에 로그인 전용 "오토리스 승계심사신청"이 여전히 살아있다. 즉 **신규 영업(취급)은 끝났지만 기존 계약자의 승계 서비스는 별도로 존속**한다 — `companies.ts`처럼 "영업 종료 = 승계도 불가"로 단정하면 안 되는 사례다 | capital.miraeasset.com/ib20/mnu/BCWCOMM000020 | 해결 |
| 미래에셋캐피탈 온라인 승계 신청 | 마이페이지 메뉴에 "오토리스 승계심사신청" 항목이 실제로 존재함을 코드에서 확인(`goMenu('BCWMYAC130100')`). 로그인 세션 뒤에 있어 입력 항목·수수료 산식 본문은 열람 못함 | capital.miraeasset.com/ib20/mnu/BCWCOMM000020 | 웹 밖(로그인 필요) |
| 미래에셋캐피탈 연락처 | 페이지 내장 JS 상수 `SMS_AUTH_NUMBER = "18116800"` — `competitor-landscape.md` 제공값(1811-6800)과 **일치**. 기존 [2차] 검색 스니펫에서 **[확인]으로 격상** | capital.miraeasset.com (인라인 스크립트) | 해결 |
| K카캐피탈 접속 | `kcarcapital.com`(non-www)은 403이지만 `www.kcarcapital.com`은 UA만 지정하면 200. 이전 실패는 www 누락 때문으로 보인다 | www.kcarcapital.com | 해결 |
| K카캐피탈 승계(리스·렌터카) 상품 존재 여부 | 사이트 전체 메뉴(`/uf`, `/ur`, `/ow`, `/cs`)가 "중고차 할부 신청" 단일 상품 라인이다. og:title "대한민국 대표 중고차 전문 금융, 케이카캐피탈"이고 `kcar.com`(케이카) 링크가 걸려 있어 **케이카 계열 중고차 할부금융사**로 확인된다. 리스·렌터카·승계 메뉴 자체가 없다 → **이 항목은 애초에 성립하지 않는다**(승계할 리스/렌트 상품이 없음) | www.kcarcapital.com (전체 메뉴) | 해결(해당없음) |
| K카캐피탈 연락처 | "고객센터 : 1566-2860 ... 사업자등록번호 : 318-81-09236, 대표이사 조재형" — 제공값(1566-2860)과 **일치** | www.kcarcapital.com (푸터) | 해결 |

---

## 2. 재확인 3건

| 항목 | 결과 | 출처 | 상태 |
|---|---|---|---|
| 승계고 2026-09-04 공지 제목·날짜 | 공지 목록에서 재현: **"[공지] 승계고 장기렌트 · 리스 승계 대행 서비스가 곧 시작됩니다! (9월 오픈 예정)" — 2026-09-04 14:45:16**. 제목 자체는 "유료화"가 아니라 **"대행 서비스 출시 예고"**다. "유료화" 여부는 본문에 있을 수 있으나 확인 못함(아래) | sggo.kr/notice | 해결(제목·날짜만) |
| 승계고 공지 본문 전체 | 목록이 Vue(`data-v-*`) `<button>` 클릭 라우팅이라 정적 fetch·firecrawl 정적 스크랩으로는 본문이 열리지 않는다. `firecrawl interact`로 클릭을 시도했으나 세션이 `fetch failed`로 실패 | sggo.kr/notice | 웹 밖 |
| iM캐피탈 `sucsCnslCar.do` 1개월/1회차 문구 | 오늘 재확인해도 동일: "최소 승계 가능 시기 : 최초 여신 실행일로부터 **1개월경과 또는 1회차** 납부일의 익영업일 이후" / "승계 후 재승계 : 승계로부터 **1개월** 경과 후" — `bench-finance.md` §5.3 기록과 그대로 일치 | www.imcap.co.kr/automobile/sucsCnslCar.do | 해결 |
| 엔카 `fem.encar.com` 현대캐피탈 직판 고지 | `tier2-platforms.md` §4.2가 확인한 매물(아이오닉6, idx=42721599)을 재열람. 판매자정보 "현대캐피탈\| 금융상담"(딜러 아님), "현대캐피탈 리스 차량입니다", "엔카닷컴은 현대캐피탈의 대출 모집 업무를 대리·중개합니다" 고지 동일 재현. **추가로 확인**: "여신금융협회 심의필 제2026-C1h-07578호 **(2026.05.22 ~ 2027.05.21)**" — 오늘(2026-09-15) 기준 심의 유효기간 내. "현대캐피탈 준법감시심의필 제260512-010호", "광고 제작월 2026.5"도 재현 | fem.encar.com/cars/detail/42721599 | 해결 |

---

## 3. 상충 4건

| 항목 | 결과 | 출처 | 상태 |
|---|---|---|---|
| 카딩 안심직거래 수수료 1% vs 1.5% | 오늘도 동일하게 상충 재현: 약관 제7조(시행일자 2026년 5월 1일 명시)는 **"인수가의 1%(최소 60만원)"**, `/product`와 `/guide/safe-direct-trade`는 둘 다 **"1.5%(최소 60만원)"**. `/notice` 전체(2024-04~2026-08, 보도자료·업데이트 로그 전부)를 확인했으나 수수료 변경 공지를 찾지 못했다. 약관 제7조 자체가 "수수료 정책 변경 시 적용일 14일 전 공지"를 명시하는데 그런 공지가 없다는 것은 (a) 마케팅 페이지가 약관 개정 없이 앞서갔거나 (b) 약관이 갱신되지 않은 것 둘 다 가능해 **날짜만으로 판정 불가** | carding.co.kr/terms, /product, /guide/safe-direct-trade, /notice | 웹 밖 |
| 딜앤딜 165만원 vs "상담 시 안내" | 홈 배너 텍스트("차종 관계없이 동일하게 165만원의 고정 수수료만 발생합니다")는 오늘도 원문 그대로 재현되고, 배너 이미지 자산 경로에 `20260506`이라는 숫자열이 들어 있다(이미지 업로드/CDN 캐싱 시점일 뿐 공식 게시일이 아니다). FAQ("정확한 수수료는 차량 조건에 따라 상담 시 안내") 항목은 게시일이 "딜앤딜 2026-05-19"로 **명시적 저작일**이 붙어 있다 — 이미지 경로 숫자와 FAQ 게시일은 성격이 다른 값이라 직접 비교로 선후를 확정할 수 없다. 또한 두 문장은 **동시에 참일 수 있다**(165만원이 표준값이고, 조건에 따라 예외적으로 "상담 시 안내"하는 구조) — 이 경우 날짜로는 애초에 풀리지 않는 문제다 | dealndeal.co.kr/ (이미지 자산 경로), dealndeal.co.kr/faq (게시일 표기) | 웹 밖 |
| iM캐피탈 승계 가능 시기 3개월/3회차 vs 1개월/1회차 | 오늘 두 URL을 다시 열어도 값이 그대로다: `sucsCnslCar.do`(1개월/1회차) vs `myCarSucsGuide.do`(3개월/3회차, "승계 후 재승계: 3개월 경과 후 & 3회 수납"). 두 페이지 모두 no-cache 동적 페이지라 `Last-Modified` 헤더가 없고, 본문 어디에도 시행일·개정일 표기가 없다. 나머지 조건(대상고객, 승계금액 산식, 승계수수료 산식·상한)은 두 페이지가 완전히 동일해 상품 차이(scope)로 볼 근거도 없다 | www.imcap.co.kr/automobile/sucsCnslCar.do, /customer/myCarSucsGuide.do | 웹 밖 |
| 우리금융캐피탈 수수료 상한 50만 vs 100만 | **상충이 아니라 상품 차이였다.** 테슬라 제휴 페이지(`TESLALoan.do`, 오토 운용리스)만 최대 50만원이고, 일반 상품 두 곳 모두 최대 100만원이다: "오토 금융리스"(`financingmall/goods.do?webGdCd=HS_AT01`) "승계수수료: 미회수원금×1%×(잔여기간일수/리스기간전체일수), 최소30만원 최대100만원", "장기렌터카"(`?webGdCd=HS-RC03`) "승계수수료: 미회수원금×1%×(잔여기간월수/렌트기간전체월수), 최소30만원 최대100만원" — 둘 다 `bench-finance.md` §8의 차즘 고지문(최대 100만원)과 일치한다. 테슬라 전용 상품에만 낮은 캡이 적용되는 구조다 | woorifcapital.com/popup/loan/counsel/TESLALoan.do, /financingmall/goods.do?webGdCd=HS_AT01, ?webGdCd=HS-RC03 | 해결 |

---

## 4. 미열람 업체 4곳 프로필

### 리렌트레이드 (제이와이오토)
- **법인**: 주식회사 제이와이오토, 사업자등록번호 741-87-03400, 인천 남동구 청능대로 559, 대표 양현민·정건호, 연락처 010-****-****(개인 휴대전화, 마스킹) [확인, jyat.co.kr/15 푸터]
- **판정**: [판단] **3층(견적 중개)**. 자기소개("리렌트레이드에서 장기렌트/리스/할부까지 모든 견적을 한 번에 비교 도와드리겠습니다", "21개사 전격 비교"), 무료 선언("모든 상담이 무료이며 어떤 금전적 요구도 하지 않겠습니다"), 매도자용 등록 폼·수수료 안내 페이지 부재가 모두 3층 쪽을 가리킨다. `/15`·`/26`의 모든 배너 CTA가 `learentd.co.kr/18`(견적 상담) 하나로 수렴하는 것도 리드젠 구조의 증거다. 홈 화면의 지원금 반영 확정가 매물(예: "[지원금 200만원] 미니쿠퍼 jwc 리스 승계 918,790원")은 **매칭 마켓플레이스가 아니라 리렌트레이드가 직접 취급하는 광고성 재고**로 보는 것이 자기소개 문구와 일치한다
- **돈 흐름**: 신차 견적은 "모든 상담 무료" 명시. 홈에 걸린 승계 매물 판매가엔 지원금이 이미 반영돼 있으나, 그 매물을 누가 어떤 수수료로 취급하는지 사이트에 안내가 없음 [확인/미확인]
- **앱**: 스토어 등록 없음(imweb 기반 웹사이트만) [확인]

### 겟차
- **법인**: (주)겟차, 사업자등록번호 243-87-00137, 대표 정유철, 서울 강남구 삼성로91길 32, 전화 1800-0456 [확인, web.getcha.kr/promotion/business-only]
- **판정**: [확인] 순수 3층(견적 중개). 브랜드·월납입금·바디타입·연료로 신차 장기렌트/리스 견적을 비교하는 것이 핵심 기능. "리스승계" 관련 콘텐츠는 블로그 5편·커뮤니티 게시글뿐이고, 승계 매물을 게시·검색하는 기능은 없다
- **앱**: Google Play 평점 4.4(4,631) [확인]
- **승계 접점**: 콘텐츠 마케팅(블로그) 수준. 매칭·중개 기능 없음 [판단]

### 인피니티카
- **법인**: 회사소개 페이지에 사업자등록번호 게시 없음(미확인). 전화 1533-4649, 네이버카페 `cafe.naver.com/weallsucceeded` [확인]
- **판정**: [확인] 1층 직접 경쟁, 대행형(카딩 안심대행·이어카 빠른승계·딜앤딜과 동일 계열). "내 리스·렌트 차량 무료등록" → 매니저가 원스톱으로 승계 대행
- **규모**: 승계 진행중 611대, 총 승계완료 5,346대, 최근등록(30일) 164대(자체 표기, 2026-09-15) [확인]
- **과금**: 정확한 금액은 비공개("리스·렌트 승계 대행 업체 중 가장 저렴한 수수료"라고만 주장). FAQ 원문: "승계 차량의 인수금 + 수수료를 더한 방식이기 때문에... 결국 판매자분께서 승계 수수료를 부담하는 것이나 다름없다"(구매자에겐 별도 청구 안 함을 시사) [확인]

### 헤이리스 (헤이리스.com)
- **법인**: 등록명 **스마트상사**(개인 매매상사), 대표 김강원, 본점 수원시 권선구 권선로 308-5, 소재지 인천 서구 봉수대로 158 [확인, 홈 푸터]
- **판정**: [판단] **2층(플랫폼·렌터카사 채널)**. "승계신청"(`/?m=counsel&s=lease`) 폼으로 불특정 개인의 승계 매물을 받긴 하지만, 목록(`/?m=sale&s=list`)은 개인 간 직거래 매칭이 아니라 **단일 매매상사(스마트상사)가 승계신청으로 받은 재고를 자사 재고처럼 채워 되파는 채널**이다 — 매물이 월 리스료·선납금 조건으로 진열되고 인수금·지원금 필드가 없는 것이 그 증거다. 랜드스케이프 §1.2의 "롯데렌터카: 자사 계약 차량만 등록하는 승계 게시판" 유형과 같은 계층으로 판정한다
- **매물 필드**: 선납금(예: 0원), 개월수(24~60개월), 월 납입액만 확인. 인수금·지원금 표시는 목록에서 못 찾음 [확인/미확인]

---

## 미확인 목록

| # | 항목 | 막힌 이유 | 확인 방법 |
|---|---|---|---|
| 1 | MG캐피탈 승계 절차 전용 페이지(온라인 신청·서류·자격조건) | 상품 페이지엔 수수료 산식만 있고 별도 절차 안내 페이지를 찾지 못함 | 사이트 재탐색 또는 고객센터(1588-9688) |
| 2 | 미래에셋캐피탈 오토리스 승계수수료 산식·전체 절차 | "오토리스 승계심사신청" 메뉴가 마이페이지(로그인 후) SPA/AJAX 콘텐츠라 정적 스크랩으로 본문에 도달 못함 | 회원 로그인 후 확인(회원가입은 브리프 규칙상 금지 — 사람이 직접 확인 필요) |
| 3 | 승계고 2026-09-04 공지 본문 전체("유료화" 여부 포함) | Vue 라우터의 `<button>` 클릭 방식이라 정적 fetch·firecrawl 정적 스크랩 모두 본문 미도달. `firecrawl interact` 클릭 시도는 `fetch failed`로 실패 | 브라우저에서 직접 클릭해 본문 확인 |
| 4 | 카딩 안심직거래 수수료 1%/1.5% 중 실제 적용값 | 약관(1%, 시행일 2026-05-01)과 마케팅 페이지(1.5%) 상충, `/notice`에 변경 공지 없음, 양쪽 다 날짜로 우열을 가릴 근거 없음 | 고객센터(1844-2238) 문의 |
| 5 | 딜앤딜 165만원 vs 상담 시 안내 중 실제 적용값 | 홈 배너 이미지 경로 추정일(2026-05-06)과 FAQ 게시일(2026-05-19)이라는 정황 신호뿐, 공식 개정 이력이 없음 | 카카오톡 상담(dealndeal.co.kr 내 상담 채널) 또는 전화 문의 |
| 6 | iM캐피탈 승계 가능 시기 1개월/1회차 vs 3개월/3회차 중 실제 적용값 | 두 공식 URL 모두 시행일·개정일 표기가 없고 나머지 조건은 완전히 동일해 상품 차이로도 설명 안 됨 | 승계센터(1566-8808) 문의 |
| 7 | 인피니티카 법인명·사업자등록번호·통신판매업 신고번호 | 회사소개(`about.php`)·서비스 소개(`service.php`) 어디에도 게시 없음(스크린샷상 푸터 콘텐츠 미포함일 가능성) | 사이트 최하단 푸터 직접 열람 또는 통신판매업 조회 |
| 8 | 헤이리스 승계신청 접수 후 실제 매칭·수수료 체계 | `/?m=counsel&s=lease`는 개인정보 수집 동의 + 신청 폼뿐, 매칭 로직·수수료율이 사이트에 없음 | 다이렉트 상담(사이트 내 카카오 채널) 문의 — 전화·상담 필요 |
| 9 | 리렌트레이드 승계 매물의 수수료 체계(등록비·성사수수료) | 매물 판매가는 있으나 신차 견적과 달리 승계 매물 쪽 수수료 안내 페이지를 찾지 못함 | 카카오톡 상담(`pf.kakao.com/_YkfYxj`) 문의 |
