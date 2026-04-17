export type ProductType = "laminat" | "quartzvinyl";

export const PRODUCT_TYPES = [
  { value: "laminat", label: "Ламинат" },
  { value: "quartzvinyl", label: "Кварцвинил" },
] as const;

export type ColorItem = {
  id: string;
  name: string;
  productType: ProductType;
  tone?: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export const TONES = [
  "светлый",
  "тёмный",
  "серый",
  "натуральный",
  "белёный",
  "коричневый",
  "чёрный",
] as const;