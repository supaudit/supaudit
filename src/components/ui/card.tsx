import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

const Card = component$<PropsOf<"div">>((props) => {
  return (
    <div
      {...props}
      class={cn(
        "rounded-lg border bg-card text-card-foreground shadow",
        props.class,
      )}
    >
      <Slot />
    </div>
  );
});

const CardHeader = component$<PropsOf<"div">>((props) => {
  return (
    <div {...props} class={cn("flex flex-col space-y-1.5 p-6", props.class)} />
  );
});

const CardTitle = component$<PropsOf<"h3">>((props) => {
  return (
    <h3
    {...props}
      class={cn("font-semibold leading-none tracking-tight", props.class)}
    />
  );
});

const CardDescription = component$<PropsOf<"p">>((props) => {
  return (
    <p {...props} class={cn("text-sm text-muted-foreground", props.class)} />
  );
});

const CardContent = component$<PropsOf<"div">>((props) => {
  return <div {...props} class={cn("p-6 pt-0", props.class)} />;
});

const CardFooter = component$<PropsOf<"div">>((props) => {
  return (
    <div {...props} class={cn("flex items-center p-6 pt-0", props.class)} />
  );
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
