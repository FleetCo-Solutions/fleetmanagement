import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/actions/notifications";

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await getNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["markNotificationAsRead"],
    mutationFn: async (id?: string) => await markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
