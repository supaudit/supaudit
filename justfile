#!/usr/bin/env just --justfile

up:
    supabase start
    supabase functions serve

restart:
    supabase stop
    supabase start

apply-migrations:
    supabase db reset

test:
    deno test --allow-net -- --recursive

ci:
    (just up &)
    sleep 5 # TODO: Wait for HTTP endpoint
    just test
