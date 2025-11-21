import { getDepartments } from "@/actions/departments";
import { getRoles } from "@/actions/roles";
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
  ProfilePayload
} from "@/app/types";
import { addEmergencyContact, updateEmergencyContact as updateAction, deleteEmergencyContact as deleteAction } from "@/actions/emergencyContact";
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
}

export const useRolesQuery = () => {
  return useQuery<IRoles>({
    queryKey: ["Roles"],
    queryFn: async () => await getRoles(),
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
    mutationFn: async ({ id, userData }: { id: string; userData: ProfilePayload }) =>
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (payload: EmergencyContactPayload) => await addEmergencyContact(payload),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({queryKey:["User", userId]})
      } else {
         queryClient.invalidateQueries({queryKey:["User"]})
      }
    }
  })
}

export const useUpdateEmergencyContact = (userId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async ({id, payload}: {id: string, payload: EmergencyContactPayload}) => await updateAction(id, payload),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({queryKey:["User", userId]})
      } else {
        queryClient.invalidateQueries({queryKey:["User"]})
      }
    }
  })
}

export const useDeleteEmergencyContact = (userId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (id: string) => await deleteAction(id),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({queryKey:["User", userId]})
      } else {
        queryClient.invalidateQueries({queryKey:["User"]})
      }
    }
  })
}
