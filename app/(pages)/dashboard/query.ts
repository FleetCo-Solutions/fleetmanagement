import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/actions/dashboard";

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => await getDashboardSummary(),
    refetchInterval: 60000, // Refetch every minute
  });
};
