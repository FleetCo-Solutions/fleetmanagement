import { addVehicle, getVehicles, AddVehiclePayload, getVehiclesList, getVehicleDetails } from "@/actions/vehicles";
import { IPostVehicle } from "@/app/api/vehicles/post";
import { IVehicles, VehicleDetailsResponse, VehiclesList } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
}

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addVehicle"],

    mutationFn: async (vehicleData: IPostVehicle) => await addVehicle(vehicleData),

    // Always refetch to be safe
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehicles"] });
    },
  });
};

export const useVehicleDetailsQuery = (id: string) => {
  return useQuery<VehicleDetailsResponse>({
    queryKey: ["VehicleDetails"],
    queryFn: async () => await getVehicleDetails(id),
  });
}