import { createContextId, Signal } from "@builder.io/qwik";

export const DarkModeContext = createContextId<Signal<boolean>>(
    "app.dark-mode",
);
