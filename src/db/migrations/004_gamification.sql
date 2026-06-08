CREATE TABLE IF NOT EXISTS sellers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  shop_name    VARCHAR(100) NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  level        SMALLINT NOT NULL DEFAULT 1,
  level_name   VARCHAR(50) NOT NULL DEFAULT 'Haus Wantok',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS point_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL,
  reason      VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_events_seller ON point_events(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_level ON sellers(level);
