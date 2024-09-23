import { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async ({ sharedMap, redirect }) => {
  const user = sharedMap.get("user");

  if (!user) {
    redirect(302, "/login");
  }
};