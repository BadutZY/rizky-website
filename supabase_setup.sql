-- ============================================================
-- SUPABASE SETUP: kimmy_live_status
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Buat tabel
CREATE TABLE IF NOT EXISTS public.kimmy_live_status (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform     TEXT NOT NULL CHECK (platform IN ('idn', 'showroom')),
  is_live      BOOLEAN NOT NULL DEFAULT false,
  stream_url   TEXT,
  stream_title TEXT,
  viewer_count INTEGER,
  thumbnail_url TEXT,
  started_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Insert baris awal (satu per platform)
INSERT INTO public.kimmy_live_status (platform, is_live)
VALUES
  ('idn',      false),
  ('showroom', false)
ON CONFLICT DO NOTHING;

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.kimmy_live_status ENABLE ROW LEVEL SECURITY;

-- 4. Policy: siapa pun bisa READ (anon / authenticated)
CREATE POLICY "Allow public read" ON public.kimmy_live_status
  FOR SELECT USING (true);

-- 5. Policy: hanya authenticated yang bisa UPDATE
--    (cocok untuk admin / dashboard update)
CREATE POLICY "Allow authenticated update" ON public.kimmy_live_status
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Aktifkan Realtime untuk tabel ini
--    (Pastikan di Dashboard → Database → Replication → kimmy_live_status sudah ON)
ALTER PUBLICATION supabase_realtime ADD TABLE public.kimmy_live_status;

-- ============================================================
-- CONTOH UPDATE (jalankan saat Kimmy mulai live):
-- ============================================================
/*
-- Set IDN Live = ON
UPDATE public.kimmy_live_status SET
  is_live      = true,
  stream_url   = 'https://example.com/stream/kimmy.m3u8',
  stream_title = 'Sesi Reguler - Kimmy JKT48',
  viewer_count = 1500,
  thumbnail_url = 'https://example.com/thumb/kimmy.jpg',
  started_at   = now(),
  updated_at   = now()
WHERE platform = 'idn';

-- Set IDN Live = OFF
UPDATE public.kimmy_live_status SET
  is_live       = false,
  stream_url    = NULL,
  stream_title  = NULL,
  viewer_count  = NULL,
  thumbnail_url = NULL,
  started_at    = NULL,
  updated_at    = now()
WHERE platform = 'idn';
*/
