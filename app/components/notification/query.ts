import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
  updateNotificationTopic,
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

export const useUpdateNotificationTopicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateNotificationTopic"],
    mutationFn: async ({
      topicSlug,
      data,
    }: {
      topicSlug: string;
      data: { name?: string; description?: string; defaultChannels?: string[] };
    }) => await updateNotificationTopic(topicSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationTopics"] });
    },
  });
};
