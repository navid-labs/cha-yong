const MARKETING_ASSETS_BASE_URL =
  "https://gbfsdacyyocpflfufykk.supabase.co/storage/v1/object/public/marketing-assets";

export function marketingImageUrl(path: string): string {
  const normalizedPath = path
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${MARKETING_ASSETS_BASE_URL}/${normalizedPath}`;
}

export const marketingImages = {
  heroGrandeur: marketingImageUrl("hero/grandeur-teaser.webp"),
  heroBmw: marketingImageUrl("hero/bmw-vehicle.webp"),
  heroGenesis: marketingImageUrl("hero/genesis-vehicle.webp"),
  heroHyundai: marketingImageUrl("hero/hyundai-vehicle.webp"),
  leaseCar: marketingImageUrl("lease-car.webp"),
  reviewBmw: marketingImageUrl("reviews/520imps_review.webp"),
  reviewGv80: marketingImageUrl("reviews/gv80_review.webp"),
} as const;

export function getVehicleFallbackImage(brand?: string | null, model?: string | null): string {
  const vehicleName = `${brand ?? ""} ${model ?? ""}`.toLowerCase();

  if (vehicleName.includes("bmw") || vehicleName.includes("520") || vehicleName.includes("320")) {
    return marketingImages.heroBmw;
  }

  if (
    vehicleName.includes("genesis") ||
    vehicleName.includes("제네시스") ||
    vehicleName.includes("g80") ||
    vehicleName.includes("gv80")
  ) {
    return marketingImages.heroGenesis;
  }

  if (
    vehicleName.includes("hyundai") ||
    vehicleName.includes("현대") ||
    vehicleName.includes("그랜저") ||
    vehicleName.includes("ioniq") ||
    vehicleName.includes("아이오닉")
  ) {
    return marketingImages.heroHyundai;
  }

  return marketingImages.leaseCar;
}
