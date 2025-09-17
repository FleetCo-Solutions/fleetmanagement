import { addVehicle, getVehicles, AddVehiclePayload } from "@/actions/vehicles";
import { IVehicles } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVehicleQuery = () => {
  return useQuery<IVehicles>({
    queryKey: ["Vehicles"],
    queryFn: async () => await getVehicles(),
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addVehicle"],

    mutationFn: async (vehicleData: AddVehiclePayload) => await addVehicle(vehicleData),

    // // Optimistic update before request
    // onMutate: async (newVehicle: Vehicle) => {
    //   await queryClient.cancelQueries({ queryKey: ["Vehicles"] });

    //   const previousVehicles =
    //     queryClient.getQueryData<Vehicle[]>(["Vehicles"]) || [];

    //   // Optimistically update cache
    //   queryClient.setQueryData<Vehicle[]>(["Vehicles"], (old) => [
    //     ...old,
    //     newVehicle,
    //   ]);

    //   return { previousVehicles };
    // },

    // // On error, rollback
    // onError: (_err, _newVehicle, context) => {
    //   if (context?.previousVehicles) {
    //     queryClient.setQueryData(["Vehicles"], context.previousVehicles);
    //   }
    // },

    // Always refetch to be safe
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehicles"] });
    },
  });
};
