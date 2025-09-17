import { addDriver, getDriverDashboard, getDrivers, AddDriverPayload } from "@/actions/drivers";
import { IDriver } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDriverQuery = () => {
  return useQuery<IDriver>({
    queryKey: ["Drivers"],
    queryFn: async () => await getDrivers(),
  });
};

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
