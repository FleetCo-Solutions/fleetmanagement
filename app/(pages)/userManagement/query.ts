import { getDepartments } from "@/actions/departments";
import {
  getNotificationGroups,
  createNotificationGroup,
  updateNotificationGroup,
  getNotificationTopics,
} from "@/actions/notificationGroups";
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getPermissions,
} from "@/actions/roles";
import {
  addUser,
  changePassword,
  getUserDetails,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "@/actions/users";
import {
  IAddUser,
  IUsers,
  BackendUser,
  IRoles,
  IDepartments,
  UserDetails,
  EmergencyContactPayload,
  ProfilePayload,
  IEditUser,
} from "@/app/types";
import {
  addEmergencyContact,
  updateEmergencyContact as updateAction,
  deleteEmergencyContact as deleteAction,
} from "@/actions/emergencyContact";
import {
  getUserDocuments,
  getUserDocumentsSummary,
  uploadUserDocument,
  updateUserDocument,
  deleteUserDocument,
} from "@/actions/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserQuery = () => {
  return useQuery<IUsers>({
    queryKey: ["Users"],
    queryFn: async () => await getUsers(),
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery<UserDetails>({
    queryKey: ["User", id],
    queryFn: async () => await getUserDetails(id),
  });
};

export const useRolesQuery = () => {
  return useQuery<any[]>({
    queryKey: ["Roles"],
    queryFn: async () => await getRoles(),
  });
};

export const usePermissionsQuery = () => {
  return useQuery<any[]>({
    queryKey: ["Permissions"],
    queryFn: async () => await getPermissions(),
  });
};

export const useDepartmentsQuery = () => {
  return useQuery<IDepartments>({
    queryKey: ["Departments"],
    queryFn: async () => await getDepartments(),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addUser"],
    mutationFn: async (userData: IAddUser) => await addUser(userData),

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async ({ id, userData }: { id: string; userData: IEditUser }) =>
      await updateUser(id, userData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["User", userId] });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStatusUser"],
    mutationFn: async ({ id, string }: { id: number; string: string }) =>
      await toggleUserStatus(id, string),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async ({
      userId,
      password,
      oldPassword,
    }: {
      userId: string;
      password: string;
      oldPassword: string;
    }) => await changePassword({ userId, password, oldPassword }),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};

export const useAddEmergencyContact = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (payload: EmergencyContactPayload) =>
      await addEmergencyContact(payload),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["User", userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["User"] });
      }
    },
  });
};

export const useUpdateEmergencyContact = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: EmergencyContactPayload;
    }) => await updateAction(id, payload),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["User", userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["User"] });
      }
    },
  });
};

export const useDeleteEmergencyContact = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (id: string) => await deleteAction(id),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["User", userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["User"] });
      }
    },
  });
};

export const useAddRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addRole"],
    mutationFn: async (roleData: any) => await addRole(roleData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRole"],
    mutationFn: async ({ id, roleData }: { id: string; roleData: any }) =>
      await updateRole(id, roleData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: async (id: string) => await deleteRole(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
    },
  });
};

export const useNotificationGroupsQuery = () => {
  return useQuery({
    queryKey: ["NotificationGroups"],
    queryFn: async () => await getNotificationGroups(),
  });
};

export const useCreateNotificationGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createNotificationGroup"],
    mutationFn: async (data: any) => await createNotificationGroup(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["NotificationGroups"] });
    },
  });
};

export const useUpdateNotificationGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateNotificationGroup"],
    mutationFn: async ({ groupId, data }: { groupId: string; data: any }) =>
      await updateNotificationGroup(groupId, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["NotificationGroups"] });
    },
  });
};
export const useNotificationTopicsQuery = () => {
  return useQuery({
    queryKey: ["NotificationTopics"],
    queryFn: async () => await getNotificationTopics(),
  });
};

export const useUserDocumentsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userDocuments", userId],
    queryFn: () => getUserDocuments(userId),
    enabled: !!userId,
  });
};

export const useUserDocumentsSummaryQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userDocumentsSummary", userId],
    queryFn: () => getUserDocumentsSummary(userId),
    enabled: !!userId,
  });
};

export const useUploadUserDocumentMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadUserDocument(userId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userDocuments", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userDocumentsSummary", userId],
      });
    },
  });
};

export const useUpdateUserDocumentMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, formData }: { docId: string; formData: FormData }) =>
      updateUserDocument(userId, docId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userDocuments", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userDocumentsSummary", userId],
      });
    },
  });
};

export const useDeleteUserDocumentMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteUserDocument(userId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userDocuments", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userDocumentsSummary", userId],
      });
    },
  });
};
