-- Create a table for tracking practice sessions
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  duration_seconds integer not null default 180 -- Default 3 minutes
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Policy: Users can insert their own sessions
create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

-- Policy: Users can view their own sessions
create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);
