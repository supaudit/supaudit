import { component$, Slot, useContext } from "@builder.io/qwik";
import { DarkModeContext } from "~/context";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

import {
  LuShield as Shield,
  LuMoon as Moon,
  LuSun as Sun,
} from "@qwikest/icons/lucide";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const darkMode = useContext(DarkModeContext);

  return (
    <div class={`flex min-h-screen flex-col`}>
      <header class="fixed left-0 right-0 top-0 z-50 flex h-14 items-center bg-white/80 px-4 backdrop-blur-sm dark:bg-gray-900/80 lg:px-6">
        <Link class="flex items-center justify-center" href="#">
          <div class="">
            <Shield />
          </div>
          <span class="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
            Supaudit
          </span>
        </Link>
        <nav class="ml-auto flex gap-4 sm:gap-6">
          <Link
            class="flex items-center text-sm font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            href="#features"
          >
            Documentation
          </Link>
          <button
            onClick$={() => (darkMode.value = !darkMode.value)}
            class="rounded-full bg-gray-200 p-2 dark:bg-gray-700"
          >
            {darkMode.value ? (
              <Sun class="h-4 w-4" />
            ) : (
              <Moon class="h-4 w-4" />
            )}
          </button>
        </nav>
      </header>
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  scripts: [
    {
      script: `
		if (localStorage.getItem("theme") === "dark") {
		  document.documentElement.classList.add("dark");
		};
		`,
    },
  ],
};
