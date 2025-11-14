import { DEFAULT_PAGE } from "@/constants";
import { parseAsInteger, parseAsString,  useQueryStates, parseAsStringEnum } from "nuqs";
import { InterviewStatus } from "../types";

export const useInterviewsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(InterviewStatus)),
    agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
