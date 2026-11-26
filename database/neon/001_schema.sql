-- SEBAS PUNTO DE VENTA — Neon PostgreSQL schema
-- Apply ONLY after enabling Neon Managed Better Auth + Data API.
-- Tenant boundary: every row carries owner_id from the verified JWT.
-- Never expose the database owner connection string in the Android/web client.

create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null default auth.user_id(),
  name text not null check (length(trim(name)) > 0),
  owner_name text not null default '',
  phone text not null default '',
  currency char(3) not null default 'MXN',
  logo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  name text not null,
  sku text not null default '',
  price numeric(14,2) not null check (price >= 0),
  cost numeric(14,2) not null default 0 check (cost >= 0),
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 0 check (min_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id, owner_id),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade
);
create unique index if not exists products_business_sku_unique on public.products(business_id, lower(sku)) where sku <> '';

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  unique (id, business_id, owner_id),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  unique (id, business_id, owner_id),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  folio text not null,
  sold_at timestamptz not null default now(),
  customer_id uuid,
  customer_name text not null default 'Público general',
  payment text not null check (payment in ('Efectivo','Tarjeta','Transferencia')),
  total numeric(14,2) not null check (total >= 0),
  received numeric(14,2),
  change numeric(14,2) not null default 0,
  status text not null default 'COMPLETADA',
  created_at timestamptz not null default now(),
  unique (business_id, folio),
  unique (id, business_id, owner_id),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade,
  foreign key (customer_id, business_id, owner_id) references public.customers(id, business_id, owner_id) on delete set null (customer_id)
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  sale_id uuid not null,
  product_id uuid,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  unit_cost numeric(14,2) not null check (unit_cost >= 0),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade,
  foreign key (sale_id, business_id, owner_id) references public.sales(id, business_id, owner_id) on delete cascade,
  foreign key (product_id, business_id, owner_id) references public.products(id, business_id, owner_id) on delete set null (product_id)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  folio text not null,
  supplier_id uuid,
  supplier_name text not null,
  reference text not null default '',
  purchased_at timestamptz not null default now(),
  total numeric(14,2) not null check (total >= 0),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade,
  foreign key (supplier_id, business_id, owner_id) references public.suppliers(id, business_id, owner_id) on delete set null (supplier_id),
  unique (business_id, folio),
  unique (id, business_id, owner_id)
);

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  purchase_id uuid not null,
  product_id uuid,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_cost numeric(14,2) not null check (unit_cost >= 0),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade,
  foreign key (purchase_id, business_id, owner_id) references public.purchases(id, business_id, owner_id) on delete cascade,
  foreign key (product_id, business_id, owner_id) references public.products(id, business_id, owner_id) on delete set null (product_id)
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  product_id uuid,
  movement_type text not null check (movement_type in ('VENTA','COMPRA','AJUSTE','DEVOLUCION')),
  quantity integer not null,
  detail text not null default '',
  reference text not null default '',
  created_at timestamptz not null default now(),
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade,
  foreign key (product_id, business_id, owner_id) references public.products(id, business_id, owner_id) on delete set null (product_id)
);

create table if not exists public.cash_closures (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  owner_id text not null default auth.user_id(),
  opened_at timestamptz,
  closed_at timestamptz not null default now(),
  opening numeric(14,2) not null default 0,
  cash_sales numeric(14,2) not null default 0,
  refunds numeric(14,2) not null default 0,
  expected numeric(14,2) not null default 0,
  counted numeric(14,2) not null default 0,
  difference numeric(14,2) not null default 0,
  notes text not null default '',
  foreign key (business_id, owner_id) references public.businesses(id, owner_id) on delete cascade
);

-- Enable row-level isolation for every tenant-owned table.
do $$
declare t text;
begin
  foreach t in array array['businesses','products','customers','suppliers','sales','sale_items','purchases','purchase_items','stock_movements','cash_closures']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists tenant_owner_only on public.%I', t);
    execute format(
      'create policy tenant_owner_only on public.%I for all to authenticated using (owner_id = (select auth.user_id())) with check (owner_id = (select auth.user_id()))',
      t
    );
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

grant usage on schema public to authenticated;
