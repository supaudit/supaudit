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
    wait4x http http://127.0.0.1:54321/ --expect-status-code 404 --timeout 2m
    just test
