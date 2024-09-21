import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

import { css } from "~/styled-system/css";
import { button } from '@shadow-panda/styled-system/recipes'


export default component$(() => {
  return (
    <>
      <h1 class={css({fontFamily: "Space Grotesk Variable", fontSize: "6xl", fontWeight: 700})}>Supaudit</h1>
      <button class={button({ variant: 'outline' })}>Login</button>
    </>
  );
});

export const head: DocumentHead = {
  title: "Generate security audit reports · Supaudit",
  meta: [
    {
      name: "Supaudit",
      content: "Generate security audit reports",
    },
  ],
};
