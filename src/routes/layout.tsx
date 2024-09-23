import { component$, Slot, useContext } from "@builder.io/qwik";
import { DarkModeContext } from "~/context";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link, routeAction$ } from "@builder.io/qwik-city";
import type { Database } from "~/database.types";

import {
  LuShield as Shield,
  LuMoon as Moon,
  LuSun as Sun,
  LuLogOut as LogOut,
} from "@qwikest/icons/lucide";
import { createServerClient } from "supabase-auth-helpers-qwik";

import { useAuthenticatedUser } from "~/lib/loaders";
export { useAuthenticatedUser } from "~/lib/loaders";

export const useLogoutUser = routeAction$(async (_, { sharedMap, redirect }) => {
  const supabase = sharedMap.get("supabase");
  await supabase.auth.signOut();
  throw redirect(302, "/login");
});

export const onRequest: RequestHandler = async (requestEv) => {
  const supabase = createServerClient<Database>(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv,
  );
  requestEv.sharedMap.set("supabase", supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  requestEv.sharedMap.set("user", user);
};

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
  const user = useAuthenticatedUser();
  const logoutUser = useLogoutUser();

  return (
    <div class={`flex min-h-screen flex-col`}>
      <header class="fixed left-0 right-0 top-0 z-50 flex h-14 items-center bg-white/80 px-4 backdrop-blur-sm dark:bg-gray-900/80 lg:px-6">
        <Link class="flex items-center justify-center" href="/">
          <div>
            <Shield class="h-6 w-6 text-primary" />
          </div>
          {!user.value && (
            <span class="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              Supaudit
            </span>
          )}
        </Link>
        <nav class="ml-auto flex gap-4 sm:gap-6">
          <Link
            class="flex items-center text-sm font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            href="/docs"
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
          {user.value && (
            <button
              onClick$={async () => await logoutUser.submit()}
              class="rounded-sm bg-red-500 p-2"
            >
              <LogOut class="h-4 w-4 text-white" />
            </button>
          )}
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
