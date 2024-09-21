import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { menubar } from "@shadow-panda/styled-system/recipes";

export const Dashboard = component$(() => {
  return (
    <>
      <header>
        <nav class={menubar({})}>
            <div class={menubar({menu: true})}>File</div>
        </nav>
      </header>
      <main></main>
    </>
  );
});
