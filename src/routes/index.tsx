import { DocumentHead } from "@builder.io/qwik-city";
import { QButton as Button } from "~/components/ui/button";
import { Link } from "@builder.io/qwik-city";
import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";

export default component$(() => {
  const mousePosition = useSignal({ x: 0, y: 0 });
  const heroRef = useSignal<Element>();

  const handleMouseMove = $((event: MouseEvent) => {
    if (heroRef.value) {
      const rect = heroRef.value.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mousePosition.value = { x, y };
    }
  });

  useStyles$(`
    @keyframes pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
      100% {
        transform: scale(0.95);
        opacity: 0.7;
      }
    }
    .animate-pulse-slow {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `);

  return (
    <main class="flex-1">
      <section
        ref={heroRef}
        onMouseMove$={handleMouseMove}
        class="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background dark:from-primary/10 dark:via-primary/5 dark:to-gray-900">
          <div class="bg-grid-white/10 bg-grid animate-grid-fade absolute inset-0" />
          <div
            class="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${mousePosition.value.x / 50}px, ${mousePosition.value.y / 50}px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <div class="max-h-4xl h-full w-full max-w-4xl">
              <svg viewBox="0 0 100 100" class="h-full w-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  class="animate-pulse-slow text-primary/10"
                  style={{ animationDelay: "0s" }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  class="animate-pulse-slow text-primary/20"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  class="animate-pulse-slow text-primary/30"
                  style={{ animationDelay: "1s" }}
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="container relative z-10 px-4 md:px-6">
          <div class="flex flex-col items-center space-y-4 text-center">
            <div class="space-y-2">
              <h1 class="font-display text-3xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                Revolutionize Your Security Audits with Supaudit
              </h1>
              <p class="mx-auto max-w-[700px] text-gray-700 dark:text-gray-300 md:text-xl">
                Streamline auditing and reporting in one powerful platform
              </p>
            </div>
            <div class="space-x-4">
              <Link href="/login">
                <Button
                  class="bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-gray-900 dark:hover:bg-primary/90"
                  size="lg"
                >
                  Log in to Supaudit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Generate security audit reports · Supaudit",
  meta: [
    {
      name: "Supaudit",
      content: "Generate security audit reports",
    },
  ],
};
