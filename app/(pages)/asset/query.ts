import { unassignDriver } from "@/actions/drivers";
import {
  addVehicle,
  getVehicles,
  getVehiclesList,
  getVehicleDetails,
  updateVehicle,
} from "@/actions/vehicles";
import { IPostVehicle } from "@/app/api/vehicles/post";
import { IVehicles, VehicleDetailsResponse, VehiclesList } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useVehicleQuery = () => {
  return useQuery<IVehicles>({
    queryKey: ["Vehicles"],
    queryFn: async () => await getVehicles(),
  });
};

export const useVehiclesListQuery = () => {
  return useQuery<VehiclesList>({
    queryKey: ["VehiclesList"],
    queryFn: async () => await getVehiclesList(),
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addVehicle"],

    mutationFn: async (vehicleData: IPostVehicle) =>
      await addVehicle(vehicleData),

    // Always refetch to be safe
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehicles"] });
    },
  });
};

export const useVehicleDetailsQuery = (id: string) => {
  return useQuery<VehicleDetailsResponse>({
    queryKey: ["VehicleDetails", id],
    queryFn: async () => await getVehicleDetails(id),
  });
};

export const useUpdateVehicle = (vehicleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateVehicle", vehicleId],
    mutationFn: async (payload: {
      registrationNumber: string;
      model: string;
      manufacturer: string;
      vin: string;
      color: string;
    }) => await updateVehicle(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["VehicleDetails", vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

export const useUnassignDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["unassignDriver"],
    mutationFn: async (driverId: string) => await unassignDriver(driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VehicleDetails"] });
      queryClient.invalidateQueries({ queryKey: ["DriversList"] });
    },
  });
};

// Re-export hooks from drivers query to use in asset pages
export {
  useDriversListQuery,
  useAssignVehicleToDriver,
} from "../drivers/query";
