import { addDriver, getDriverDashboard, getDrivers, AddDriverPayload, getDriversList, assignDriverToVehicle } from "@/actions/drivers";
import { AssignDriverRequestBody } from "@/app/api/drivers/assignDriver/post";
import { DriversList, IDriver } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDriverQuery = () => {
  return useQuery<IDriver>({
    queryKey: ["Drivers"],
    queryFn: async () => await getDrivers(),
  });
};

export const useDriversListQuery = () => {
  return useQuery<DriversList>({
    queryKey: ["DriversList"],
    queryFn: async () => await getDriversList(),
  });
}

export const useAddDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addDriver"],
    mutationFn: async (driverData: AddDriverPayload) => await addDriver(driverData),

    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["Drivers"] });
    },
  });
};

export const useAssignVehicleToDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["assignVehicleToDriver"],
    mutationFn: async (payload: AssignDriverRequestBody) => await assignDriverToVehicle(payload),

    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["Drivers"] });
    },
  });
}

export const useDriverDashboardQuery = () => {
  return useQuery({
    queryKey: ["DriverDashboard"],
    queryFn: async () => await getDriverDashboard(),
  });
};

// export const useUpdateDriverStatus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ['updateDriverStatus'],
//     mutationFn: async ({id}: {id: number}) => await updateDriverStatus(id),
