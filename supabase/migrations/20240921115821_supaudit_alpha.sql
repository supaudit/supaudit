/*
  File: 20240921115821_supaudit_alpha.sql

  Description:
  This SQL script creates a table named 'reports' and defines a trigger function named 'update_updated_at_column'.
  The 'reports' table has the following columns:
  - id: UUID column serving as the primary key with a default value generated using the gen_random_uuid() function.
  - user_id: UUID column referencing the 'id' column of the 'auth.users' table with a cascade delete constraint.
  - title: Text column storing the title of the report.
  - content: JSONB column storing the content of the report.
  - state: JSONB column storing the state of the report.
  - created_at: Timestamp with time zone column storing the creation timestamp of the report with a default value of the current timestamp.
  - updated_at: Timestamp with time zone column storing the last updated timestamp of the report with a default value of the current timestamp.

  The 'update_updated_at_column' function is a trigger function that updates the 'updated_at' column of the 'reports' table with the current timestamp whenever an update operation is performed on the table.

  Triggers:
  - update_reports_updated_at: Trigger defined on the 'reports' table that executes the 'update_updated_at_column' function before each update operation.

*/
-- Migrations will appear here as you chat with AI

create type phase as enum ('discovery', 'structuring', 'formatting', 'disclosed', 'completed');

create table reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Report',
  phase phase not null default 'discovery',
  content jsonb not null default '{}'::jsonb,
  state jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table reports enable row level security;

create policy "Users can access their own reports"
on reports for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own reports"
on reports for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can modify their own reports"
on reports for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own reports"
on reports for delete
to authenticated
using (auth.uid() = user_id);

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
