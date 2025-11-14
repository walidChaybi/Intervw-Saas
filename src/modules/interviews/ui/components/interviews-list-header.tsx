"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

import { NewMeetingDialog } from "./new-interview-dialog";
import { InterviewsSearchFilter } from "./interviews-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useInterviewsFilters } from "../../hooks/use-interviews-filters";

const InterviewsListHeader = () => {
  const [filters, setFilters] = useInterviewsFilters();
  const [isOpen, setIsOpen] = useState(false);
  const isAnyFilterModified = Boolean(
    filters.search || filters.status || filters.agentId
  );

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: null,
      page: DEFAULT_PAGE,
      agentId: "",
    });
  };

  return (
    <>
      <NewMeetingDialog open={isOpen} onOpenChange={setIsOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Interviews</h5>
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon />
            New Interview
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <InterviewsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <XCircleIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default InterviewsListHeader;
