import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { SearchHub } from "@/features/home/search-hub";
import { TrustStripe } from "@/features/home/trust-stripe";
import { StoryCards } from "@/features/home/story-cards";
import { HowItWorksTimeline } from "@/features/home/how-it-works-timeline";
import { SellCtaBanner } from "@/features/home/sell-cta-banner";
import { LiveActivityFeed } from "@/features/home/live-activity-feed";
import { CostCalculatorHome } from "@/features/home/cost-calculator-home";
import { CustomerStories } from "@/features/home/customer-stories";
import { marketingImages } from "@/lib/marketing-images";
import type { ListingCardData } from "@/types";

export const dynamic = "force-dynamic";

const QUICK_ENTRIES = [
  { label: "내 차 사기", href: "/list", image: marketingImages.heroBmw },
  { label: "내 차 팔기", href: "/sell", image: marketingImages.heroGenesis },
  { label: "월납입 계산", href: "#cost-calculator", image: marketingImages.heroGrandeur },
  { label: "안심거래", href: "#trust-flow", image: marketingImages.heroHyundai },
  { label: "상담 지점", href: "/guide", image: marketingImages.leaseCar },
] as const;

async function getRecommendedListings(): Promise<ListingCardData[]> {
  const selectFields = {
    id: true,
    type: true,
    brand: true,
    model: true,
    year: true,
    trim: true,
    mileage: true,
    monthlyPayment: true,
    initialCost: true,
    remainingMonths: true,
    isVerified: true,
    accidentCount: true,
    mileageVerified: true,
    viewCount: true,
    favoriteCount: true,
    options: true,
    images: { where: { isPrimary: true }, take: 1, select: { url: true } },
  } as const;

  // Try verified+active first, fall back to newest active only if empty
  let listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", isVerified: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: selectFields,
  });

  if (listings.length === 0) {
    listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: selectFields,
    });
  }

  return listings.map((l) => ({
    id: l.id,
    type: l.type,
    brand: l.brand,
    model: l.model,
    year: l.year,
    trim: l.trim,
    mileage: l.mileage,
    monthlyPayment: l.monthlyPayment,
    initialCost: l.initialCost,
    remainingMonths: l.remainingMonths,
    isVerified: l.isVerified,
    accidentCount: l.accidentCount,
    mileageVerified: l.mileageVerified,
    viewCount: l.viewCount,
    favoriteCount: l.favoriteCount,
    options: l.options,
    primaryImage: l.images[0]?.url ?? null,
  }));
}

async function getNewListingCount(): Promise<number> {
  const now = new Date();
  return prisma.listing.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    },
  });
}

async function getTopBrands(): Promise<string[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    distinct: ["brand"],
    take: 10,
    select: { brand: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.brand).filter((b): b is string => Boolean(b));
}

export default async function HomePage() {
  const [listings, newListingCount, topBrands] = await Promise.all([
    getRecommendedListings(),
    getNewListingCount(),
    getTopBrands(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden rounded-2xl bg-[var(--chayong-bg)] px-5 py-10 md:px-10 md:py-14"
        style={{ border: "1px solid rgba(27, 89, 199, 0.12)" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.96)_0%,rgba(240,246,255,0.78)_42%,rgba(255,255,255,0.2)_100%)]" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          {/* Left: headline + entry */}
          <div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold"
                  style={{ color: "var(--chayong-primary)" }}
                >
                  월납입 중심 비교
                </span>
                {newListingCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs font-semibold tabular-nums" style={{ color: "var(--chayong-text)" }}>
                    이번 달 신규 {newListingCount}건
                  </span>
                )}
                <span
                  className="inline-flex items-center rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs font-semibold"
                  style={{ color: "var(--chayong-text)" }}
                >
                  안심매물
                </span>
                <span
                  className="inline-flex items-center rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs font-semibold"
                  style={{ color: "var(--chayong-text)" }}
                >
                  에스크로 보호
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight md:text-5xl" style={{ color: "var(--chayong-text)" }}>
                월 납입금만 보고
                <br />
                <span style={{ color: "var(--chayong-primary)" }}>간편하게 비교하세요</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 md:text-base md:leading-7" style={{ color: "var(--chayong-text-sub)" }}>
                초기 비용, 잔여 기간, 검수 상태를 한 화면에서 확인하고 승계 매물을 빠르게 비교하세요. 차용은 찾는 흐름과 등록 흐름을 같은 무게로 연결합니다.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/list"
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:min-w-36"
                style={{ backgroundColor: "var(--chayong-primary)" }}
              >
                매물 검색하기
              </Link>
              <Link
                href="/sell"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white/80 px-5 text-sm font-semibold transition-colors hover:bg-white sm:min-w-36"
                style={{
                  borderColor: "rgba(255,255,255,0.65)",
                  color: "var(--chayong-text)",
                }}
              >
                내 차 등록하기
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium md:text-sm" style={{ color: "var(--chayong-text-sub)" }}>
              {["상담 전 부담 확인", "검수 조건 확인", "계약은 사람이 직접"].map((item) => (
                <span key={item} className="rounded-full border border-white/50 bg-white/35 px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: vehicle-first hero media */}
          <div className="relative min-h-[480px] overflow-hidden rounded-2xl border bg-white chayong-shadow-lg sm:min-h-[420px]" style={{ borderColor: "rgba(27, 89, 199, 0.14)" }}>
            <Image
              src={marketingImages.heroGrandeur}
              alt="차용 승계 매물 차량"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(15,23,42,0.18)_68%,rgba(15,23,42,0.48)_100%)]" />

            <div className="absolute left-4 top-4 rounded-2xl border bg-white/90 p-4 shadow-sm backdrop-blur md:left-5 md:top-5" style={{ borderColor: "rgba(255,255,255,0.72)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--chayong-primary)" }}>
                빠른 조건 예시
              </p>
              <h2 className="mt-1 text-xl font-bold md:text-2xl" style={{ color: "var(--chayong-text)" }}>
                월 부담부터 확인
              </h2>
            </div>

            <div className="absolute inset-x-4 bottom-4 grid gap-2 rounded-2xl border bg-white/92 p-3 shadow-sm backdrop-blur md:inset-x-5 md:bottom-5 md:grid-cols-3 md:p-4" style={{ borderColor: "rgba(255,255,255,0.72)" }}>
              {[
                { label: "월 납입", value: "58만원", helper: "예상 월 부담" },
                { label: "초기 비용", value: "140만원", helper: "선납/보증금 포함" },
                { label: "잔여 기간", value: "32개월", helper: "남은 계약 기간" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-xl border bg-white/80 px-3 py-2"
                  style={{ borderColor: "var(--chayong-border)" }}
                >
                  <div className="text-xs font-medium" style={{ color: "var(--chayong-text-caption)" }}>
                    {item.label}
                  </div>
                  <div className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--chayong-text)" }}>
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--chayong-text-sub)" }}>
                    {item.helper}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 빠른승계 대행 ── */}
      <section className="py-4 md:py-6">
        <div
          className="relative overflow-hidden rounded-3xl border px-5 py-6 md:px-8 md:py-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(225,238,255,0.92) 100%)",
            borderColor: "rgba(27, 89, 199, 0.14)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: "var(--chayong-primary)" }} />
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--chayong-primary)" }}
                >
                  빠른승계
                </span>
                <span className="inline-flex items-center rounded-full border border-[var(--chayong-divider)] bg-white px-3 py-1 text-xs font-semibold text-[var(--chayong-text)]">
                  일반 등록 무료
                </span>
                <span className="inline-flex items-center rounded-full border border-[var(--chayong-divider)] bg-white px-3 py-1 text-xs font-semibold text-[var(--chayong-text)]">
                  매니저 대행 빠른승계
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--chayong-text)" }}>
                내 차를
                <span style={{ color: "var(--chayong-primary)" }}> 빠른승계</span>로 맡기고 싶다면
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 md:text-base md:leading-7" style={{ color: "var(--chayong-text-sub)" }}>
                일반 등록은 무료로 시작하고, 매니저 대행 빠른승계는 검수와 노출 운영을 함께 맡기는 방식입니다. 가격은 기획 기준이며 상담 시 확정됩니다.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "매니저 검수", value: "등록 전 확인" },
                  { label: "상단 노출", value: "선별 매물 강조" },
                  { label: "증명 신호", value: "후기 또는 절감액" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border bg-white/75 px-4 py-3" style={{ borderColor: "rgba(27, 89, 199, 0.12)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--chayong-text-caption)" }}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: "var(--chayong-text)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border bg-white p-4 md:p-5" style={{ borderColor: "rgba(27, 89, 199, 0.14)" }}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--chayong-divider)] bg-[var(--chayong-surface)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--chayong-text-caption)" }}>
                    일반 등록
                  </p>
                  <p className="mt-2 text-xl font-bold" style={{ color: "var(--chayong-text)" }}>
                    무료
                  </p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--chayong-text-sub)" }}>
                    혼자 등록하고 기본 노출만 원하는 경우
                  </p>
                </div>

                <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "rgba(27, 89, 199, 0.2)", backgroundColor: "rgba(27, 89, 199, 0.06)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--chayong-primary)" }}>
                    매니저 대행 빠른승계
                  </p>
                  <p className="mt-2 text-xl font-bold" style={{ color: "var(--chayong-text)" }}>
                    등록비 99,000원
                  </p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--chayong-text-sub)" }}>
                    완료 수수료: 중고차 시세 4%
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--chayong-text)" }}>
                    최저 수수료 770,000원, VAT 포함
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed px-4 py-3" style={{ borderColor: "rgba(27, 89, 199, 0.22)", backgroundColor: "rgba(255,255,255,0.92)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--chayong-text)" }}>
                  매니저가 검수하고 상단 노출까지 챙기는 빠른승계 상품입니다.
                </p>
                <p className="mt-1 text-xs leading-5" style={{ color: "var(--chayong-text-sub)" }}>
                  상담 과정에서 조건을 확인한 뒤 최종 금액이 확정됩니다.
                </p>
              </div>

              <Link
                href="/sell"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--chayong-primary)" }}
              >
                내 차 빠른승계 신청
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Entries ── */}
      <section className="py-4 md:py-6" aria-label="빠른 시작">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_ENTRIES.map(({ label, href, image }) => (
            <Link
              key={label}
              href={href}
              className="group flex min-h-[124px] flex-col items-center justify-center gap-3 rounded-2xl border border-transparent px-3 py-4 text-center transition-colors hover:border-[var(--chayong-divider)] hover:bg-[var(--chayong-surface)]"
            >
              <span className="relative h-16 w-20 overflow-hidden rounded-xl bg-[var(--chayong-surface)] shadow-sm transition-transform group-hover:-translate-y-0.5">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </span>
              <span className="whitespace-nowrap text-sm font-bold text-[var(--chayong-text)]">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Search Hub ── */}
      <section className="py-3 md:py-4">
        <SearchHub brands={topBrands} />
      </section>

      {/* ── Trust Stripe ── */}
      <section id="trust-flow" className="my-3 md:my-4">
        <TrustStripe />
      </section>

      {/* ── Live Activity Feed ── */}
      <section className="my-3 md:my-4">
        <LiveActivityFeed />
      </section>

      {/* ── 지금, 이 매물 어때요? ── */}
      <section id="cost-calculator" className="py-4 md:py-6">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div>
            <h2 className="text-xl font-bold md:text-2xl" style={{ color: "var(--chayong-text)" }}>
              지금, 이 매물 어때요?
            </h2>
            <p className="mt-0.5 text-xs md:text-sm" style={{ color: "var(--chayong-text-sub)" }}>실시간으로 매칭되는 승계 매물을 확인해보세요.</p>
          </div>
          <Link
            href="/list"
            className="text-xs font-medium md:text-sm"
            style={{ color: "var(--chayong-primary)" }}
          >
            전체보기 &gt;
          </Link>
        </div>

        {listings.length === 0 ? (
          <div
            className="flex h-48 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--chayong-surface)" }}
          >
            <p className="text-sm" style={{ color: "var(--chayong-text-caption)" }}>
              등록된 매물이 없습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing, i) => (
              <VehicleCard key={listing.id} listing={listing} priority={i === 0} />
            ))}
          </div>
        )}
      </section>

      {/* ── Cost Calculator ── */}
      <section className="py-4 md:py-6">
        <CostCalculatorHome />
      </section>

      {/* ── Story Cards ── */}
      <section className="py-4 md:py-6">
        <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl" style={{ color: "var(--chayong-text)" }}>
          차용으로 이런 거래가 가능해요
        </h2>
        <StoryCards />
      </section>

      {/* ── How It Works Timeline ── */}
      <section className="mb-4 py-5 md:mb-6 md:py-8">
        <h2 className="mb-5 text-xl font-bold md:mb-8 md:text-2xl" style={{ color: "var(--chayong-text)" }}>
          이용 방법
        </h2>
        <div className="max-w-lg">
          <HowItWorksTimeline />
        </div>
      </section>

      {/* ── Customer Stories ── */}
      <section className="py-5 md:py-8">
        <CustomerStories />
      </section>

      {/* ── Sell CTA Banner ── */}
      <section className="mb-6 md:mb-8">
        <SellCtaBanner />
      </section>
    </div>
  );
}
