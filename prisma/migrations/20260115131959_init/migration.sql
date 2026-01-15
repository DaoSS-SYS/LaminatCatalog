-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "brand" TEXT,
    "collection" TEXT,
    "tone" TEXT,
    "wearClass" INTEGER,
    "thicknessMm" INTEGER,
    "plankSize" TEXT,
    "bevelType" TEXT,
    "waterResistant" BOOLEAN NOT NULL DEFAULT false,
    "surfaceType" TEXT,
    "pricePerM2" DOUBLE PRECISION,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "imagesJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Color_name_idx" ON "Color"("name");

-- CreateIndex
CREATE INDEX "Color_brand_idx" ON "Color"("brand");

-- CreateIndex
CREATE INDEX "Color_collection_idx" ON "Color"("collection");

-- CreateIndex
CREATE INDEX "Color_tone_idx" ON "Color"("tone");
