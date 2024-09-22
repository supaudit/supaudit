import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, /* useForm, */ valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";

import { QButton as Button } from "~/components/ui/button";
import { QInput as Input } from "~/components/ui/input";
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
    const supabase = createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv,
    );

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error === null) {
      throw requestEv.redirect(302, "/");
    }
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  // const [, { Form, Field }] = useForm<LoginForm>({
  //   loader: useFormLoader(),
  //   action: useFormAction(),
  //   validate: valiForm$(LoginSchema),
  // });

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
        <form class="space-y-6">
          <div class="space-y-2">
            <Label htmlFor="email" class="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              class="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div class="space-y-2">
            <Label htmlFor="password" class="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label
                htmlFor="remember-me"
                class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </Label>
            </div>
            <div class="text-sm">
              <Link href="#" class="font-medium text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            class="w-full bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-gray-900 dark:hover:bg-primary/90"
          >
            Log in
          </Button>
        </form>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="#" class="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );

  /* return (
    <div>
      <h1>Login to Supaudit</h1>
      <Form>
        <Field name="email">
          {(field, props) => (
            <>
              <p>Email address</p>
              <input {...props} type="email" value={field.value} />
            </>
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <>
              <p>Password</p>
              <input {...props} type="password" value={field.value} />
            </>
          )}
        </Field>
        <button type="submit">Login</button>
      </Form>
    </div>
  );
  */
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
