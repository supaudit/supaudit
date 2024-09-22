import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

import type { InitialValues } from "@modular-forms/qwik";
import {
  formAction$,
  useForm,
  /* useForm, */ valiForm$,
} from "@modular-forms/qwik";
import * as v from "valibot";

import { QButton as Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { QLabel as Label } from "~/components/ui/label";

// Input validation logic
const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ),
});

type LoginForm = v.InferInput<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export const useFormAction = formAction$<LoginForm>(
  async (values, requestEv) => {
    // Authenticate user with Supabase Auth
    const supabaseClient = createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv
    );

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error === null) {
      throw requestEv.redirect(302, "/studio");
    }
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  const [, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  return (
    <main class="flex flex-1 items-center justify-center p-4">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Log in to Supaudit
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>
        <Form class="flex flex-col space-y-4">
          <Field name="email">
            {(field, props) => (
              <div class="space-y-1">
                <Label htmlFor="email" class="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  {...props}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  class="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                  value={field.value}
                />
              </div>
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <div class="space-y-2">
                <Label
                  htmlFor="password"
                  class="text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <Input
                  {...props}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  class="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                  value={field.value}
                />
              </div>
            )}
          </Field>
          <Button
            type="submit"
            class="w-full bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-gray-900 dark:hover:bg-primary/90"
          >
            Log in
          </Button>
        </Form>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Login · Supaudit",
  meta: [
    {
      name: "Login",
      content: "Login to Supaudit",
    },
  ],
};
