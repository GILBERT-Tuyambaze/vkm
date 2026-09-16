-- SQL Schema for VIKM GROUP Submissions & Admin System

-- 1. Create quotes table
create table if not exists public.quotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null,
  details text not null,
  location text,
  size text,
  start_date text,
  budget text,
  client_name text not null,
  phone text not null,
  whatsapp text,
  email text not null,
  status text default 'Pending' check (status in ('Pending', 'In Review', 'Contacted', 'Completed', 'Archived')),
  notes text
);

-- 2. Enable Row Level Security (RLS) on quotes
alter table public.quotes enable row level security;

create policy "Allow anonymous quote creation"
  on public.quotes
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow read access for admin"
  on public.quotes
  for select
  to anon, authenticated
  using (true);

create policy "Allow update access for admin"
  on public.quotes
  for update
  to anon, authenticated
  using (true);

-- 3. Create admin_invitations table for team member invites
create table if not exists public.admin_invitations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  role text default 'Admin' not null,
  invited_by text not null,
  token text not null,
  status text default 'Pending' check (status in ('Pending', 'Accepted', 'Expired')),
  expires_at timestamp with time zone not null
);

alter table public.admin_invitations enable row level security;

create policy "Allow read/insert/update invitations"
  on public.admin_invitations
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 4. Indexes for fast query and sorting
create index if not exists idx_quotes_created_at on public.quotes(created_at desc);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quotes_type on public.quotes(type);
create index if not exists idx_admin_invitations_email on public.admin_invitations(email);
