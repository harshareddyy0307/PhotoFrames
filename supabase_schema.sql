-- Drop tables if they exist
drop table if exists orders;
drop table if exists profiles;
drop table if exists staff_members;
drop table if exists promo_codes;
drop table if exists products;

-- 1. Products Table
create table products (
  id text primary key,
  name text not null,
  category text,
  price numeric not null,
  description text,
  sizes jsonb,
  size_prices jsonb,
  image text,
  featured boolean default false,
  stock integer default 0,
  created_at timestamptz default now()
);

-- 2. Promo Codes Table
create table promo_codes (
  id text primary key,
  code text unique not null,
  discount_type text not null,
  discount_value numeric not null,
  expiry_date date,
  min_order_value numeric default 0,
  max_discount_limit numeric,
  usage_limit integer,
  usage_count integer default 0,
  status text default 'Active',
  created_at timestamptz default now()
);

-- 3. Staff Members Table
create table staff_members (
  id text primary key,
  name text not null,
  employee_id text,
  role text,
  phone text,
  email text,
  username text unique not null,
  password text not null, -- base64 encoded
  branch text,
  status text default 'Active',
  last_login timestamptz,
  created_at timestamptz default now()
);

-- 4. Profiles Table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  address text,
  city text,
  pincode text,
  landmark text,
  created_at timestamptz default now()
);

-- 5. Orders Table
create table orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  promo_code text,
  discount numeric default 0,
  delivery numeric default 0,
  total numeric not null,
  status text default 'Pending',
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable Replication & Realtime for orders
alter table orders replica identity full;
alter publication supabase_realtime add table orders;

-- Insert default products
insert into products (id, name, category, price, description, sizes, size_prices, image, featured, stock) values
('p1', 'Elegant Walnut Frame', 'Photo Frames', 899, 'Premium solid walnut wood frame with a classic satin finish. Perfect for family portraits.', '["6x8", "8x10", "12x12"]', '{"6x8": 699, "8x10": 899, "12x12": 1199}', 'https://images.unsplash.com/photo-1544273677-c433136021d4?auto=format&fit=crop&w=600&q=80', true, 100),
('p2', 'Minimalist Black Border', 'Photo Frames', 699, 'Modern slim black matte wood frame. Enhances contemporary artwork and black-and-white photos.', '["6x8", "8x10", "12x12"]', '{"6x8": 499, "8x10": 699, "12x12": 999}', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80', false, 150),
('p3', 'Heart Collage Custom Frame', 'Customized Frames', 1499, 'Beautiful heart-shaped mosaic collage. Personalize with your memorable photographs.', '["8x10", "12x12", "16x20"]', '{"8x10": 1199, "12x12": 1499, "16x20": 1999}', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', true, 50),
('p4', 'Name-Letter Shadowbox', 'Customized Frames', 1799, 'Stunning shadowbox spelling initials and adorned with your miniature pictures.', '["12x12", "16x20"]', '{"12x12": 1799, "16x20": 2399}', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80', true, 30),
('p5', 'Love Story Memory Box', 'Gifts', 1299, 'Handcrafted wooden memory shadow box with glowing LED fairy lights and custom photos.', '["8x10", "12x12"]', '{"8x10": 999, "12x12": 1299}', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', false, 40),
('p6', 'Eternal Rose Custom Frame', 'Gifts', 1999, 'A preserved gold foil rose enclosed in an elegant standing glass frame with customized engraving.', '["6x8", "8x10"]', '{"6x8": 1699, "8x10": 1999}', 'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&w=600&q=80', true, 25),
('p7', 'Photo Calendar Wood Block', 'Others', 999, 'Desktop wooden block calendar with interchangeable high-grade photo sheets for every month.', '["6x8"]', '{"6x8": 999}', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', false, 80),
('p8', 'Acrylic Standee Block', 'Others', 1199, 'Double-sided crystal clear frameless acrylic standee block. Stands elegantly on any desk.', '["6x8", "8x10"]', '{"6x8": 899, "8x10": 1199}', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', false, 60);

-- Insert default promo codes
insert into promo_codes (id, code, discount_type, discount_value, expiry_date, min_order_value, max_discount_limit, usage_limit, usage_count, status) values
('pr-1', 'WELCOME10', 'percentage', 10, '2026-12-31', 500, 200, 100, 12, 'Active'),
('pr-2', 'FESTIVE250', 'fixed', 250, '2026-12-31', 1200, 250, 50, 4, 'Active'),
('pr-3', 'EXPIRED50', 'percentage', 50, '2025-01-01', 0, 500, 10, 10, 'Active'),
('pr-4', 'INACTIVE100', 'fixed', 100, '2026-12-31', 500, 100, 20, 0, 'Inactive');

-- Insert default staff members
insert into staff_members (id, name, employee_id, role, phone, email, username, password, branch, status) values
('st-1', 'Harshavardhan Reddy', 'EMP-9901', 'Manager', '7989856610', 'harsha@framecraft.com', 'staff1', 'MTIzNA==', 'Visakhapatnam Main', 'Active'),
('st-2', 'Vijay Kumar', 'EMP-9902', 'Designer', '9876543210', 'vijay@framecraft.com', 'designer1', 'MTIzNDU2', 'Visakhapatnam Sub', 'Active'),
('st-3', 'Rahul Sen', 'EMP-9903', 'Printer', '8765432109', 'rahul@framecraft.com', 'printer1', 'MTIzNDU2', 'Visakhapatnam Main', 'Active'),
('st-4', 'Anjali Shah', 'EMP-9904', 'Packager', '7654321098', 'anjali@framecraft.com', 'packager1', 'MTIzNDU2', 'Visakhapatnam Sub', 'Inactive');

-- 6. Row Level Security (RLS) Configurations
-- By default, modern Supabase projects enable RLS on new tables. If RLS is enabled and no policies exist,
-- public/anonymous requests (like the frontend site) will return empty results.
-- Run the following commands to either disable RLS or allow correct read/write operations.

-- Option A: Disable RLS completely on all tables (Simplest for client-side custom auth projects)
alter table products disable row level security;
alter table promo_codes disable row level security;
alter table staff_members disable row level security;
alter table profiles disable row level security;
alter table orders disable row level security;

-- Option B: Keep RLS enabled but add public access policies (Uncomment if you want to keep RLS active)
/*
alter table products enable row level security;
alter table promo_codes enable row level security;
alter table staff_members enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;

-- Products policies
create policy "Allow public read access to products" on products for select using (true);
create policy "Allow all write access to products" on products for all using (true) with check (true);

-- Promo Codes policies
create policy "Allow public read access to promo_codes" on promo_codes for select using (true);
create policy "Allow all write access to promo_codes" on promo_codes for all using (true) with check (true);

-- Staff Members policies
create policy "Allow public read access to staff_members" on staff_members for select using (true);
create policy "Allow all write access to staff_members" on staff_members for all using (true) with check (true);

-- Orders policies
create policy "Allow public insert access to orders" on orders for insert with check (true);
create policy "Allow public read access to orders" on orders for select using (true);
create policy "Allow all write access to orders" on orders for all using (true) with check (true);

-- Profiles policies
create policy "Allow public read access to profiles" on profiles for select using (true);
create policy "Allow all write access to profiles" on profiles for all using (true) with check (true);
*/

