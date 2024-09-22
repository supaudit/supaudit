/* eslint-disable qwik/loader-location */
import { routeLoader$ } from "@builder.io/qwik-city";

export const useAuthenticatedUser = routeLoader$(async ({ sharedMap }) => {
  return sharedMap.get("user");
});
