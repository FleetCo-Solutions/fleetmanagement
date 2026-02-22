import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "@/actions/documentTypes";

export function useDocumentTypesQuery(appliesTo?: string) {
  return useQuery({
    queryKey: ["documentTypes", appliesTo],
    queryFn: () => getDocumentTypes(appliesTo),
  });
}
