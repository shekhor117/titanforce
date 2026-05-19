-- Create gallery table for media items
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null,
  category text default 'photo',
  type text default 'image',
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.gallery enable row level security;

-- Create policies
create policy "gallery_read_public" on public.gallery
  for select using (true);

create policy "gallery_write_admin" on public.gallery
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists idx_gallery_category on public.gallery(category);
create index if not exists idx_gallery_featured on public.gallery(featured);
