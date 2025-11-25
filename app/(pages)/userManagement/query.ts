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
} from "@/app/types";
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async ({ id, userData }: { id: number; userData: IAddUser }) =>
      await updateUser(id, userData),

    // Optimistic UI update
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: ["Users"] });
      const previousUsers = queryClient.getQueryData<IUsers>(["Users"]);

      queryClient.setQueryData<IUsers>(["Users"], (oldUsers) => {
        if (!oldUsers) return oldUsers;

        const updatedContent = oldUsers.dto.content.map((user) => {
          // Assuming we can identify the user by email or some other unique field
          if (user.email === userData.email) {
            return {
              ...user,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
              // Note: roles and departmentData would need to be mapped properly
              // This is a simplified version for optimistic update
            };
          }
          return user;
        });

        return {
          ...oldUsers,
          dto: {
            ...oldUsers.dto,
            content: updatedContent,
          },
        };
      });

      return { previousUsers };
    },

    // Rollback if error
    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["Users"], context.previousUsers);
      }
    },

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
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
