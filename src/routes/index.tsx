import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Landing from "~/components/landing/landing";

export default component$(() => {
  return (
    <Landing />
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
