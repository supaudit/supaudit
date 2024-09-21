import {
  $,
  component$,
  useContextProvider,
  useOnDocument,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev, isServer } from "@builder.io/qwik/build";

import "@fontsource-variable/public-sans";
import "@fontsource-variable/space-grotesk";

import "./global.css";
import { DarkModeContext } from "./context";

export default component$(() => {
  const darkMode = useSignal(false);
  useContextProvider(DarkModeContext, darkMode);

  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      const isDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const localTheme = window.localStorage.getItem("theme");

      darkMode.value =
        localTheme === "dark" || (localTheme === null && isDarkScheme);
    }),
  );

  useTask$(({ track }) => {
    track(() => darkMode.value);

    if (isServer) {
      return;
    }

    window.localStorage.setItem("theme", darkMode.value ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode.value);
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}

        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
