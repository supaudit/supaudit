import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";

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
  const [, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  return (
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
});

/*
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Moon, Sun } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDarkMode)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle login logic here
    console.log('Login submitted')
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Supaudit</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
              Log in to Supaudit
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-gray-900 dark:hover:bg-primary/90">
              Log in
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Supaudit Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
*/

export const head: DocumentHead = {
  title: "Login · Supaudit",
  meta: [
    {
      name: "Login",
      content: "Login to Supaudit",
    },
  ],
};
