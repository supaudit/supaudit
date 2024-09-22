import { component$, PropsOf } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

const Checkbox = component$<PropsOf<"input">>((props) => {
  return (
    <input
      type="checkbox"
      {...props}
      class={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        props.class,
      )}
    />
  );
});

export { Checkbox };
