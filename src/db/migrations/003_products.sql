CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name          VARCHAR(150) NOT NULL,
  description   TEXT,
  price         NUMERIC(12,2) NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 0,
  category      VARCHAR(50),
  province      VARCHAR(50),
  shipping_info TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_media (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  media_type VARCHAR(10) NOT NULL DEFAULT 'image',
  sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_shop     ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
