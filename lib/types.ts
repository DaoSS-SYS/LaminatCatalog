export type ColorItem = {
  id: string;
  name: string;
  sku?: string | null;
  brand?: string | null;
  collection?: string | null;
  tone?: string | null;
  wearClass?: number | null;
  thicknessMm?: number | null;
  plankSize?: string | null;
  bevelType?: string | null;
  waterResistant: boolean;
  surfaceType?: string | null;
  pricePerM2?: number | null;
  inStock: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export const TONES = ["светлый","тёмный","серый","натуральный","белёный","коричневый","чёрный"] as const;
export const BEVELS = ["нет","2V","4V"] as const;
export const SURFACES = ["матовая","глянцевая","тиснение"] as const;
