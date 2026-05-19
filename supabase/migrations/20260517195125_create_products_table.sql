-- Create products table for store
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  stock integer default 0,
  image_url text,
  category text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- Create policies
create policy "products_read_public" on public.products
  for select using (true);

create policy "products_write_admin" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(featured);
