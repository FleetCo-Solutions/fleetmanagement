import {  IAddUser, IUsers, BackendUser, IRoles } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUserQuery = () => {
  const {data: session} = useSession();
  
  return useQuery<IUsers>({
    queryKey: ["users"],
    queryFn: async () => {
      try{
        const response = await fetch(`https://fleetco-production.up.railway.app/api/v1/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.userToken}`
          },
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(`${result.message}`);
        }

        return result;
      }catch(err){
        throw new Error((err as Error).message);
      }
    },
  });
};

export const useRolesQuery = () => {
  const {data: session} = useSession()

  return useQuery<IRoles>({
    queryKey: ["Roles"],
    queryFn: async () => {
      try{
        const response = await fetch(`https://fleetco-production.up.railway.app/api/v1/roles`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.userToken}`
          },
        })
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(`${result.message}`);
        }
        
        return result;
      }catch(err){
        throw new Error((err as Error).message);
      }
    },
  })
}

export const useAddUser = () => {
  const {data: session} = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addUser"],
    mutationFn: async (userData: IAddUser) => {
      try{
        const response = await fetch(`https://fleetco-production.up.railway.app/api/v1/user`, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.userToken}`
          },
          body: JSON.stringify(userData),
        });
        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to add user');
        }
        return result;
      }catch(err){
        throw new Error((err as Error).message);
      }
    },

    // Optimistic UI update
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<IUsers>(["users"]);
      
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

      queryClient.setQueryData<IUsers>(["users"], (oldUsers) => {
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
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["users"]});
    }
  });
}

export const useUpdateUser = () => {
  const {data: session} = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async ({ id, userData }: { id: number, userData: IAddUser }) => {
      try{
        const response = await fetch(`https://fleetco-production.up.railway.app/api/v1/user/${id}`, { 
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.userToken}`
          },
          body: JSON.stringify(userData),
        });
        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update user');
        }
        return result;
      }catch(err){
        throw new Error((err as Error).message);
      }
    },

    // Optimistic UI update
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<IUsers>(["users"]);
      
      queryClient.setQueryData<IUsers>(["users"], (oldUsers) => {
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
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },

    // Always refetch after success/failure to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["users"]});
    }
  });
}
