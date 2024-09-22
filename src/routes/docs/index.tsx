/* eslint-disable qwik/jsx-img */
import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
    return (
        <main class="flex pt-14 w-screen h-screen justify-center items-center">
            <article class="animate-spin-slow">
            <img width="220" height="260" src="/public/jackhammer.webp" alt="Jackhammer" />
            <h1>UNDER CONSTRUCTION!!11!1!</h1>
            <p>Need docs?</p>
            <p>everybody knows that l33t h4x0rz read the source code instead lololol</p>
            </article>
        </main>
    );
});

export const head: DocumentHead = {
    title: "UNDER CONSTRUCTION!!11!1!",
  };
  