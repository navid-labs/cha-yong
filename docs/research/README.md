# 조사 문서 색인

이 폴더는 차용(Chayong)이 승계·리스/렌트 거래 플랫폼 시장을 조사하며 모은 1차·2차 소스 기반 기록이다. 여기 있는 문서는 **사실 수집**이지 결정이 아니다 — 무엇을 채택할지는 스펙 문서(`docs/superpowers/specs/`)와 GitHub 이슈에서 정해진다. 조사 문서 안의 "권장"·"결론" 문구도 그 조사를 한 사람의 판단이며, 별도 결정 절차 없이 코드에 반영되지 않는다.

2026-09 벤치마킹은 Phase 1 스펙(`docs/superpowers/specs/2026-05-06-chayong-phase-1-scope.md`)이 "별도 문서화 보강 필요"로 남긴 Q1~Q17 영역(매물 데이터 모델·수익·벤치마킹)의 **조사 자료**다. 이 자료에서 나온 설계 질문은 매트릭스 §8의 결정 지점 53개로 정리돼 있고, 결정은 후속 결정 지도에서 내린다. 용어는 루트 `CONTEXT.md`를 따른다. 조사 중 모은 원시 스크랩(`.firecrawl/`)은 git에서 제외돼 저장소에 없다.

## 어디서부터 읽나

- 경쟁사·과금 비교를 한 장으로 보려면 → [2026-09-15-bench-matrix.md](2026-09-15-bench-matrix.md) (쉬운 말로 풀어 쓴 판: https://claude.ai/artifact/6TQYcVWMrQRqzrH17rQGkD)
- 금융사별 승계수수료 계산법과 승계 절차를 보려면 → [2026-09-15-bench-finance.md](2026-09-15-bench-finance.md)
- 이어카를 보려면 → 9월 [2026-09-15-bench-eacar.md](2026-09-15-bench-eacar.md)가 5월 [2026-05-06-eacar-platform-audit.md](2026-05-06-eacar-platform-audit.md)를 재정리하고 약관 기준으로 보강했으니 9월 문서부터
- 법률·규제 리스크를 확인하려면 → [2026-09-15-bench-regulation.md](2026-09-15-bench-regulation.md) (법률 자문 아님, 문서 자체가 명시)
- 웹으로 아직 못 닫은 질문 목록을 보려면 → [2026-09-15-bench-offweb-checklist.md](2026-09-15-bench-offweb-checklist.md)

## 2026-09 벤치마킹 (지도 #14)

### 출발 자료

| 문서 | 다루는 것 | 티켓 | 상태 |
|---|---|---|---|
| [경쟁사·관련회사 지형 조사](2026-09-15-competitor-landscape.md) | 승계 플랫폼·신차견적·금융사 창구 최초 지형 조사 | — | — |

### 1차 조사 (#15~#23)

| 문서 | 다루는 것 | 티켓 | 상태 |
|---|---|---|---|
| [카딩 서비스 구조·과금·정산](2026-09-15-bench-carding.md) | 카딩 서비스 구조·과금·안전결제 흐름 실측 | #15 | — |
| [이어카 벤치마크 — 재정리+변화분](2026-09-15-bench-eacar.md) | 5월 감사 재정리 + 이용약관 유료상품 발견 | #16 | — |
| [다이어트카·와탕카·카브릿지](2026-09-15-bench-dietcar.md) | 1세대 승계 플랫폼 3곳 구조·요금 | #17 | — |
| [리스트레이드](2026-09-15-bench-leasetrade.md) | 가격+금리 표기 모델, 완전무료 매칭 | #18 | — |
| [자승카·승계고](2026-09-15-bench-community.md) | 커뮤니티(네이버카페) 기반 승계 매칭 구조 | #19 | — |
| [승계다이렉트·딜앤딜](2026-09-15-bench-agency.md) | 대행형 승계 플랫폼 2곳 구조 | #20 | — |
| [엔카·KB차차차·롯데렌터카](2026-09-15-bench-tier2-platforms.md) | 2층 플랫폼 승계 채널 실측 | #21 | — |
| [카넥션·카베이·오토다이렉트카·차즘](2026-09-15-bench-tier3-quote.md) | 3층 인접 신차 견적 중개 4곳 | #22 | — |
| [금융사 19곳 승계 절차](2026-09-15-bench-finance.md) | 금융사 19곳 승계 절차·수수료·온라인 UX | #23 | — |

### 2차 조사 (#25~#30)

| 문서 | 다루는 것 | 티켓 | 상태 |
|---|---|---|---|
| [경쟁 앱 리뷰·스크린샷 판독](2026-09-15-bench-reviews.md) | 경쟁 앱 스토어 리뷰·스크린샷 판독 | #25 | — |
| [인프라 제공 조건](2026-09-15-bench-infra.md) | 차량번호 조회·토스에스크로·본인인증 조건 | #26 | — |
| [승계 플랫폼 규제 요건](2026-09-15-bench-regulation.md) | 전자상거래법 등 규제 요건 검토(법률자문 아님) | #27 | — |
| [유입·유통 채널 입점 조건](2026-09-15-bench-channels.md) | 앱인토스·엔카·KB차차차 등 채널 입점 조건 | #28 | — |
| [조사 공백 메우기](2026-09-15-bench-gaps.md) | 금융사 재시도·미열람 4곳·상충 4건 보강 | #29 | — |
| [웹 밖 확인 목록](2026-09-15-bench-offweb-checklist.md) | 1·2차 조사 웹 밖 확인목록 132건 정리 | #30 | — |

### 비교 매트릭스 (#24)

매트릭스 §8 "결정 지점 53개"는 아직 열려 있는 질문 목록이며, 이 문서가 결정을 내리는 것은 아니다.

| 문서 | 다루는 것 | 티켓 | 상태 |
|---|---|---|---|
| [벤치마크 비교 매트릭스](2026-09-15-bench-matrix.md) | 경쟁사·금융사 vs 차용 종합 비교(결정지점 53개 미결, map #14) | #24 | — |

## 2026-05 Phase 1 조사

| 문서 | 다루는 것 | 티켓 | 상태 |
|---|---|---|---|
| [이어카 승계 플랫폼 실측 감사](2026-05-06-eacar-platform-audit.md) | 이어카 빠른승계 패키지 모델·수수료 실측 감사 | — | — |
| [광고 상품 카탈로그 벤치마크](2026-05-06-ad-products-benchmark.md) | 엔카·이어카·KB·헤이딜러 광고 SKU·가격 비교 | — | — |
| [K카 상세 페이지 데이터 스키마](2026-05-06-kcar-detail-schema.md) | K카 상세페이지 데이터 스키마·섹션 매핑 | — | — |
| [K카 라이브 매물 상세 풀 데이터](2026-05-06-kcar-live-detail-EC60897220.md) | K카 매물 1건 풀데이터(사진·진단·이력) 추출 | — | — |
| [승계/리스 파이프라인 6단계 점검](2026-05-06-transfer-pipeline-audit.md) | 차용 vs 이어카 승계 파이프라인 6단계 갭 점검 | — | — |
| [Phase 2 후속조사](2026-05-06-phase2-followup.md) | 엔카·헤이딜러·KB 미해결 4항목 후속 조사 | — | — |
| [Prisma 스키마 변경안 v1](2026-05-06-prisma-schema-diff.md) | enum·Listing 11필드·신규 모델 4개 변경안 | — | proposal |
| [Prisma 스키마 변경안 v2](2026-05-06-prisma-schema-diff-v2.md) | K카 진단/보험이력/평가사+광고 SKU 보강 변경안 (status 표기 모호) | — | proposal (v1 supersedes) |

## 문서 사이 관계

- 9월 이어카 문서([2026-09-15-bench-eacar.md](2026-09-15-bench-eacar.md), #16)는 5월 이어카 감사([2026-05-06-eacar-platform-audit.md](2026-05-06-eacar-platform-audit.md))를 재정리한 것이다. 뼈대는 같지만 9월에 처음 `terms.html`을 읽어 유료 서비스 5종을 추가로 확인했고, 이는 5월 문서·[2026-05-06-ad-products-benchmark.md](2026-05-06-ad-products-benchmark.md)의 "이어카=1종 SKU" 전제가 틀렸을 가능성을 제기한다.
- Prisma 스키마 변경안 v1([2026-05-06-prisma-schema-diff.md](2026-05-06-prisma-schema-diff.md))과 v2([2026-05-06-prisma-schema-diff-v2.md](2026-05-06-prisma-schema-diff-v2.md))는 v2 frontmatter warning에 따르면 "합쳐서 최종 적용"하는 관계다(v1=enum·Listing 필드·신규모델, v2=K카 진단/보험이력+PromotionSlot 확장). v2의 status 값 `proposal (v1 supersedes)`은 v1이 v2로 대체된다는 뜻인지 반대인지 모호하다.
- [2026-05-06-ad-products-benchmark.md](2026-05-06-ad-products-benchmark.md) §3.3의 "KB차차차 직거래 무료" 수치는 [2026-09-15-bench-tier2-platforms.md](2026-09-15-bench-tier2-platforms.md)(#21)가 그대로 인용한다(같은 문서 §하단에서 엔카 제휴몰도 9곳→11곳으로 갱신). 다만 [2026-09-15-bench-matrix.md](2026-09-15-bench-matrix.md)(#24)의 `sources`/`related`에는 ad-products-benchmark.md가 직접 들어있지 않다 — 매트릭스는 tier2-platforms를 거쳐서만 이 5월 자료에 닿는다.
- [2026-05-06-kcar-detail-schema.md](2026-05-06-kcar-detail-schema.md)는 매물 만료로 모바일 캐시 기준 스키마를 추출했고, 같은 날 [2026-05-06-kcar-live-detail-EC60897220.md](2026-05-06-kcar-live-detail-EC60897220.md)가 실제 라이브 매물로 이를 보강한다(양쪽 모두 서로를 `related`로 명시).
- [2026-09-15-bench-gaps.md](2026-09-15-bench-gaps.md)(#29)는 상충 4건 중 1건(우리금융캐피탈 50만/100만원 — 테슬라 제휴 상품과 일반 상품의 스코프 차이)을 해소했고, [2026-09-15-bench-offweb-checklist.md](2026-09-15-bench-offweb-checklist.md)(#30)가 이를 §4.2 "이미 해결됨"으로 반영했다. 나머지 3건은 웹 밖 확정으로 남았다.
- [2026-09-15-bench-matrix.md](2026-09-15-bench-matrix.md)(#24)는 frontmatter `sources`에 1차 조사 9개(#15~#23)·2차 조사 5개(#25~#29)·offweb-checklist(#30)·competitor-landscape.md를 모두 인용한 종합 비교표다.
