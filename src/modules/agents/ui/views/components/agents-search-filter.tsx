"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE } from "@/constants";
import { useAgentsFilters } from "../../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Filter by name"
        className="w-[200px] bg-white pl-7"
        value={filters.search}
        onChange={(event) =>
          setFilters({
            search: event.target.value,
            page: DEFAULT_PAGE,
          })
        }
      />
      <SearchIcon className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
    </div>
  );
};
