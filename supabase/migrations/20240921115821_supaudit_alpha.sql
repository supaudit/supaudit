-- Migrations will appear here as you chat with AI

create table users (
  id bigint primary key generated always as identity,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default now()
);

create table reports (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id) on delete cascade,
  title text not null,
  content text not null,
  state jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create
or replace function update_updated_at_column () returns trigger as $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language plpgsql;

create trigger update_reports_updated_at before
update on reports for each row
execute function update_updated_at_column ();

alter table reports
alter column content type jsonb using content::jsonb;
