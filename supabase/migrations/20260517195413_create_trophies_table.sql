-- Create trophies table
create table if not exists public.trophies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  year integer not null,
  category text not null default 'league',
  description text,
  icon text,
  runners_up text,
  image_url text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.trophies enable row level security;

-- Create policies
create policy "trophies_read_public" on public.trophies
  for select using (true);

create policy "trophies_write_admin" on public.trophies
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists idx_trophies_year on public.trophies(year);
create index if not exists idx_trophies_category on public.trophies(category);
create index if not exists idx_trophies_featured on public.trophies(featured);
