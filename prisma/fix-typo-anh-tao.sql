-- =====================================================
-- SQL Script to fix typo "Anh Tào" → "Anh Táo"
-- Run this directly in your PostgreSQL database
-- =====================================================

-- 1. Fix Product table
UPDATE "Product" 
SET 
  title = REPLACE(title, 'Anh Tào', 'Anh Táo'),
  brand = REPLACE(brand, 'Anh Tào', 'Anh Táo'),
  model = REPLACE(model, 'Anh Tào', 'Anh Táo'),
  "shortDescription" = REPLACE("shortDescription", 'Anh Tào', 'Anh Táo'),
  "longDescription" = REPLACE("longDescription", 'Anh Tào', 'Anh Táo')
WHERE 
  title ILIKE '%Anh Tào%' 
  OR brand ILIKE '%Anh Tào%' 
  OR model ILIKE '%Anh Tào%'
  OR "shortDescription" ILIKE '%Anh Tào%'
  OR "longDescription" ILIKE '%Anh Tào%';

-- 2. Fix RepairService table
UPDATE "RepairService"
SET 
  title = REPLACE(title, 'Anh Tào', 'Anh Táo'),
  "deviceBrand" = REPLACE("deviceBrand", 'Anh Tào', 'Anh Táo'),
  "deviceModel" = REPLACE("deviceModel", 'Anh Tào', 'Anh Táo'),
  "shortDescription" = REPLACE("shortDescription", 'Anh Tào', 'Anh Táo'),
  "longDescription" = REPLACE("longDescription", 'Anh Tào', 'Anh Táo')
WHERE 
  title ILIKE '%Anh Tào%'
  OR "deviceBrand" ILIKE '%Anh Tào%'
  OR "deviceModel" ILIKE '%Anh Tào%'
  OR "shortDescription" ILIKE '%Anh Tào%'
  OR "longDescription" ILIKE '%Anh Tào%';

-- 3. Fix SeoPage table (Blog pages)
UPDATE "SeoPage"
SET 
  title = REPLACE(title, 'Anh Tào', 'Anh Táo'),
  h1 = REPLACE(h1, 'Anh Tào', 'Anh Táo'),
  body = REPLACE(body, 'Anh Tào', 'Anh Táo'),
  "metaTitle" = REPLACE("metaTitle", 'Anh Tào', 'Anh Táo'),
  "metaDescription" = REPLACE("metaDescription", 'Anh Tào', 'Anh Táo')
WHERE 
  title ILIKE '%Anh Tào%'
  OR h1 ILIKE '%Anh Tào%'
  OR body ILIKE '%Anh Tào%'
  OR "metaTitle" ILIKE '%Anh Tào%'
  OR "metaDescription" ILIKE '%Anh Tào%';

-- 4. Fix Testimonial table
UPDATE "Testimonial"
SET 
  "customerName" = REPLACE("customerName", 'Anh Tào', 'Anh Táo'),
  "productName" = REPLACE("productName", 'Anh Tào', 'Anh Táo'),
  comment = REPLACE(comment, 'Anh Tào', 'Anh Táo')
WHERE 
  "customerName" ILIKE '%Anh Tào%'
  OR "productName" ILIKE '%Anh Tào%'
  OR comment ILIKE '%Anh Tào%';

-- 5. Fix Category table
UPDATE "Category"
SET 
  name = REPLACE(name, 'Anh Tào', 'Anh Táo'),
  description = REPLACE(description, 'Anh Tào', 'Anh Táo')
WHERE 
  name ILIKE '%Anh Tào%'
  OR description ILIKE '%Anh Tào%';

-- Show results
SELECT 'Product' as table_name, COUNT(*) as count 
FROM "Product" 
WHERE title ILIKE '%Anh Táo%' 
   OR brand ILIKE '%Anh Táo%' 
   OR "shortDescription" ILIKE '%Anh Táo%'
UNION ALL
SELECT 'SeoPage', COUNT(*) 
FROM "SeoPage" 
WHERE title ILIKE '%Anh Táo%' 
   OR body ILIKE '%Anh Táo%'
UNION ALL
SELECT 'Testimonial', COUNT(*) 
FROM "Testimonial" 
WHERE "productName" ILIKE '%Anh Táo%' 
   OR comment ILIKE '%Anh Táo%';
