import { useCallback, useState } from "react";

import { DEFAULT_PAGE } from "@/constants";

type AgentsFilters = {
  search: string;
  page: number;
};

type AgentsFiltersUpdate =
  | Partial<AgentsFilters>
  | ((previous: AgentsFilters) => AgentsFilters);

export const useAgentsFilters = () => {
  const [filters, setFiltersState] = useState<AgentsFilters>({
    search: "",
    page: DEFAULT_PAGE,
  });

  const setFilters = useCallback((update: AgentsFiltersUpdate) => {
    setFiltersState((previous) => {
      if (typeof update === "function") {
        return update(previous);
      }

      return {
        ...previous,
        ...update,
      };
    });
  }, []);

  return [filters, setFilters] as const;
};

