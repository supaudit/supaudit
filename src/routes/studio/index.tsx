import { Button, Input, Card } from "~/components/ui";
import { Checkbox } from "~/components/ui/checkbox";
import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";

import { Popover } from "@qwik-ui/headless";

import {
  LuPlus as Plus,
  LuSearch as Search,
  LuChevronUp as ChevronUp,
  LuChevronDown as ChevronDown,
  LuBarChart as BarChart,
  LuClock as Clock,
  LuFilter as Filter,
  LuX as X,
} from "@qwikest/icons/lucide";
import {
  DocumentHead,
  routeAction$,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import { SupabaseClient, User } from "supabase-auth-helpers-qwik";
import { Database } from "~/database.types";

type Report = {
  id: string;
  name: string;
  phase: "discovery" | "structuring" | "formatting" | "disclosed" | "completed";
  lastModified: string;
  created: string;
};

const phases = [
  "discovery",
  "structuring",
  "formatting",
  "disclosed",
  "completed",
] as const;

export const useReports = routeLoader$(async ({ sharedMap }) => {
  const supabase = sharedMap.get("supabase") as SupabaseClient<Database>;

  const { data, error } = await supabase
    .from("reports")
    .select("id, title, phase, updated_at, created_at");

  if (error) {
    console.error("Error fetching reports", error);
    return [];
  }

  const reports = data.map(
    (report) =>
      ({
        id: report.id,
        name: report.title,
        phase: report.phase,
        lastModified: new Date(report.updated_at ?? "").toLocaleDateString(),
        created: new Date(report.created_at ?? "").toLocaleDateString(),
      }) as Report,
  );

  return reports;
});

export const useCreateReport = routeAction$(
  async (_, { sharedMap, redirect }) => {
    const supabase = sharedMap.get("supabase") as SupabaseClient<Database>;
    const user = sharedMap.get("user") as User;

    const { data, error } = await supabase
      .from("reports")
      .insert({ user_id: user.id })
      .select("id");

    if (error) {
      console.error("Error creating report", error);
      return;
    }

    throw redirect(302, `/studio/report/${data[0].id}`);
  },
);

export default component$(() => {
  const reports = useReports();
  const searchTerm = useSignal("");
  const phaseFilters = useSignal<Set<string>>(new Set());
  const sortColumn = useSignal<keyof Report>("lastModified");
  const sortDirection = useSignal<"asc" | "desc">("desc");

  const createReport = useCreateReport();
  const nav = useNavigate();

  const filteredReports = useComputed$(() => {
    return reports.value.filter(
      (report) =>
        report.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (phaseFilters.value.size === 0 || phaseFilters.value.has(report.phase)),
    );
  });

  const sortedReports = useComputed$(() => {
    return [...filteredReports.value].sort((a, b) => {
      if (a[sortColumn.value] < b[sortColumn.value])
        return sortDirection.value === "asc" ? -1 : 1;
      if (a[sortColumn.value] > b[sortColumn.value])
        return sortDirection.value === "asc" ? 1 : -1;
      return 0;
    });
  });

  const handleSort = $((column: keyof Report) => {
    if (column === sortColumn.value) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortColumn.value = column;
      sortDirection.value = "asc";
    }
  });

  const togglePhaseFilter = $((phase: string) => {
    if (phaseFilters.value.has(phase)) {
      phaseFilters.value.delete(phase);
    } else {
      phaseFilters.value.add(phase);
    }
  });

  const clearPhaseFilters = $(() => {
    phaseFilters.value = new Set();
  });

  return (
    <main class="flex-1 overflow-auto pt-14">
      <div class="container mx-auto space-y-4 p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Your Reports
          </h1>
          <Button
            onClick$={async () => await createReport.submit()}
            class="bg-green-400 text-gray-900 hover:bg-green-200 dark:bg-green-600 dark:text-gray-100 dark:hover:bg-green-400"
          >
            <Plus class="mr-2 h-4 w-4" /> New Report
          </Button>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card class="bg-white p-4 dark:bg-gray-800">
            <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Reports Overview
            </h2>
            <div class="flex items-center justify-between">
              <BarChart class="h-8 w-8 text-primary" />
              <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.value.length}
              </span>
            </div>
          </Card>
          <Card class="bg-white p-4 dark:bg-gray-800">
            <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div class="flex items-center justify-between">
              <Clock class="h-8 w-8 text-primary" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Last update: 2 hours ago
              </span>
            </div>
          </Card>
        </div>
        <div class="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  <div class="flex items-center space-x-2">
                    <button
                      onClick$={() => handleSort("name")}
                      class="flex items-center"
                    >
                      Name{" "}
                      {sortColumn.value === "name" &&
                        (sortDirection.value === "asc" ? (
                          <ChevronUp class="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown class="ml-1 h-4 w-4" />
                        ))}
                    </button>
                    <div class="relative">
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm.value}
                        onKeyUp$={(e) =>
                          (searchTerm.value =
                            (e.target as HTMLInputElement).value ?? "")
                        }
                        class="w-32 rounded-md border-gray-300 bg-white py-1 pl-8 pr-4 text-sm dark:border-gray-600 dark:bg-gray-800"
                      />
                      <Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      {searchTerm && (
                        <button
                          onClick$={() => (searchTerm.value = "")}
                          class="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                        >
                          <X class="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  <div class="flex items-center space-x-2">
                    <button
                      onClick$={() => handleSort("phase")}
                      class="flex items-center"
                    >
                      Phase{" "}
                      {sortColumn.value === "phase" &&
                        (sortDirection.value === "asc" ? (
                          <ChevronUp class="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown class="ml-1 h-4 w-4" />
                        ))}
                    </button>
                    <Popover.Root>
                      <Popover.Trigger class="inline-flex h-8 w-8 items-center rounded-md border border-input bg-background p-0 px-2 shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <Filter class="h-4 w-4" />
                      </Popover.Trigger>
                      <Popover.Panel>
                        <div class="p-2">
                          {phases.map((phase) => (
                            <div
                              key={phase}
                              class="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`filter-${phase}`}
                                checked={phaseFilters.value.has(phase)}
                                onToggle$={() => togglePhaseFilter(phase)}
                              />
                              <label
                                for={`filter-${phase}`}
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {phase.charAt(0).toUpperCase() + phase.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                        {phaseFilters.value.size > 0 && (
                          <Button
                            variant="ghost"
                            onClick$={clearPhaseFilters}
                            class="w-full rounded-none"
                          >
                            Clear filters
                          </Button>
                        )}
                      </Popover.Panel>
                    </Popover.Root>
                  </div>
                </th>
                <th
                  scope="col"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  onClick$={() => handleSort("lastModified")}
                >
                  Last Modified{" "}
                  {sortColumn.value === "lastModified" &&
                    (sortDirection.value === "asc" ? (
                      <ChevronUp class="inline h-4 w-4" />
                    ) : (
                      <ChevronDown class="inline h-4 w-4" />
                    ))}
                </th>
                <th
                  scope="col"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  onClick$={() => handleSort("created")}
                >
                  Created{" "}
                  {sortColumn.value === "created" &&
                    (sortDirection.value === "asc" ? (
                      <ChevronUp class="inline h-4 w-4" />
                    ) : (
                      <ChevronDown class="inline h-4 w-4" />
                    ))}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {sortedReports.value.map((report) => (
                <tr
                  onClick$={() => nav(`/studio/report/${report.id}`)}
                  key={report.id}
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer"
                >
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="max-w-[200px] truncate text-sm font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                        ${
                          report.phase === "discovery"
                            ? "bg-blue-100 text-blue-800"
                            : report.phase === "structuring"
                              ? "bg-yellow-100 text-yellow-800"
                              : report.phase === "formatting"
                                ? "bg-green-100 text-green-800"
                                : report.phase === "disclosed"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {report.phase}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.lastModified}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Supaudit",
  meta: [
    {
      name: "Supaudit",
      content: "Generate security audit reports",
    },
  ],
};
