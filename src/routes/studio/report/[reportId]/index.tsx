import { component$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { SupabaseClient } from "supabase-auth-helpers-qwik";
// import { Button, Textarea } from "~/components/ui";
// import { Tooltip } from "@qwik-ui/headless";
// import { marked } from "marked";
import { Database } from "~/database.types";

// type ContentBlock = {
//   id: number
//   content: string
//   type: 'input' | 'output'
//   isCollapsed?: boolean
//   isEditing?: boolean
//   isLoading?: boolean
// }
  
// type Content = {
//   blocks: ContentBlock[]
// }

export const useReport = routeLoader$(async ({ sharedMap, params }) => {
  // Fetch a joke from a public API
  const supabase = sharedMap.get("supabase") as SupabaseClient<Database>;
  const reportId = params.reportId;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error) {
    console.error("Error fetching report:", error);
  }

  return data;
});

// const htmlString = marked.parse("# Hello, world!");
// <div dangerouslySetInnerHTML={htmlString}></div>

export default component$(() => {
  const report = useReport();

  return (
    <main class="pt-14">
      <h1>{report.value?.title}</h1>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const report = resolveValue(useReport) ?? { title: "Loading..." };
  return {
    title: `${report.title} · Supaudit`,
  };
};
