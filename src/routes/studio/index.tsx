import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <header>
        <h1>Dashboard</h1>
      </header>
      <main></main>
    </>
  );
});

export const head: DocumentHead = {
  title: "My studio · Supaudit",
  meta: [
    {
      name: "Supaudit",
      content: "Generate security audit reports",
    },
  ],
};
