-- Create active_channel_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.active_channel_messages (
  channel_id TEXT PRIMARY KEY,
  guild_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.active_channel_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public active_channel_messages are viewable by everyone" ON public.active_channel_messages FOR SELECT USING (true);
