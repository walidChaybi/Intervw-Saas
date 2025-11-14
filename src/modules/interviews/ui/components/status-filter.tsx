"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";

import { CommandSelect } from "@/components/command-select";

import { useInterviewsFilters } from "../../hooks/use-interviews-filters";
import { InterviewStatus } from "../../types";

const statusOptions = [
  {
    id: InterviewStatus.UPCOMING,
    value: InterviewStatus.UPCOMING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon className="size-4" />
        {InterviewStatus.UPCOMING}
      </div>
    ),
  },
  {
    id: InterviewStatus.ACTIVE,
    value: InterviewStatus.ACTIVE,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon className="size-4" />
        {InterviewStatus.ACTIVE}
      </div>
    ),
  },
  {
    id: InterviewStatus.COMPLETED,
    value: InterviewStatus.COMPLETED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon className="size-4" />
        {InterviewStatus.COMPLETED}
      </div>
    ),
  },
  {
    id: InterviewStatus.PROCESSING,
    value: InterviewStatus.PROCESSING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon className="size-4" />
        {InterviewStatus.PROCESSING}
      </div>
    ),
  },
  {
    id: InterviewStatus.CANCELLED,
    value: InterviewStatus.CANCELLED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon className="size-4" />
        {InterviewStatus.CANCELLED}
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useInterviewsFilters();

  return (
    <CommandSelect
      className="h-9"
      placeholder="Status"
      options={statusOptions}
      value={filters.status ?? ""}
      onSelect={(value) => setFilters({ status: value as InterviewStatus })}
    />
  );
};

