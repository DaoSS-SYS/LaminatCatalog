-- DropIndex
DROP INDEX "Color_brand_idx";

-- DropIndex
DROP INDEX "Color_collection_idx";

-- DropIndex
DROP INDEX "Color_name_idx";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "productType" TEXT NOT NULL DEFAULT 'laminat';

-- CreateIndex
CREATE INDEX "Color_productType_idx" ON "Color"("productType");
