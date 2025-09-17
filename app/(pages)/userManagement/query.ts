import { getDepartments } from "@/actions/departments";
import { getRoles } from "@/actions/roles";
import { addUser, getUsers, toggleUserStatus, updateUser } from "@/actions/users";
import {  IAddUser, IUsers, BackendUser, IRoles, IDepartments } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserQuery = () => {
  return useQuery<IUsers>({
    queryKey: ["Users"],
    queryFn: async () => await getUsers()
  });
};

export const useRolesQuery = () => {
  return useQuery<IRoles>({
    queryKey: ["Roles"],
    queryFn: async () => await getRoles()
  })
}

export const useDepartmentsQuery = () => {
  return useQuery<IDepartments>({
    queryKey: ["Departments"],
    queryFn: async () => await getDepartments()
  })
}

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addUser"],
    mutationFn: async (userData: IAddUser) => await addUser(userData),

    // Optimistic UI update
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ["Users"] });
      const previousUsers = queryClient.getQueryData<IUsers>(["Users"]);
      
      // Create a temporary user object for optimistic update
      const tempUser: BackendUser = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        status: 'active',
        lastLoginAt: null,
        roles: [], // We'll need to map role IDs to names
        departmentData: { id: newUser.departmentId, name: '' } // We'll need to get department name
      };

      queryClient.setQueryData<IUsers>(["Users"], (oldUsers) => {
        if (!oldUsers) return oldUsers;
        
        return {
          ...oldUsers,
          dto: {
            ...oldUsers.dto,
            content: [...oldUsers.dto.content, tempUser],
            totalElements: oldUsers.dto.totalElements + 1
          }
        };
      });

      return { previousUsers };
    },

    // Rollback if error
    onError: (err, newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['Users'], context.previousUsers);
      }
    },

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["Users"]});
    }
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async ({ id, userData }: { id: number, userData: IAddUser }) => await updateUser(id, userData),

    // Optimistic UI update
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: ["Users"] });
      const previousUsers = queryClient.getQueryData<IUsers>(["Users"]);
      
      queryClient.setQueryData<IUsers>(["Users"], (oldUsers) => {
        if (!oldUsers) return oldUsers;
        
        const updatedContent = oldUsers.dto.content.map(user => {
          // Assuming we can identify the user by email or some other unique field
          if (user.email === userData.email) {
            return {
              ...user,
              name: userData.name,
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
            content: updatedContent
          }
        };
      });

      return { previousUsers };
    },

    // Rollback if error
    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['Users'], context.previousUsers);
      }
    },

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["Users"]});
    }
  });
}

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStatusUser"],
    mutationFn: async ({ id, string }: { id: number, string: string}) => await toggleUserStatus(id,string),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    }
  });
}
