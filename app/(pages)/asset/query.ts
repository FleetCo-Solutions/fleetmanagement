import {
  getVehicles,
  getVehiclesList,
  getVehicleDetails,
  addVehicle,
  updateVehicle,
  getVehicleDriverHistory,
  getVehicleTrips,
} from "@/actions/vehicles";
import {
  getDriversList,
  assignDriverToVehicle,
  unassignDriverFromVehicle,
} from "@/actions/drivers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IPostVehicle } from "@/app/api/vehicles/post";
import { UpdateVehiclePayload } from "@/actions/vehicles";
import { AssignDriverPayload } from "@/actions/drivers";

export const useVehiclesQuery = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });
};

export const useVehiclesListQuery = () => {
  return useQuery({
    queryKey: ["vehiclesList"],
    queryFn: getVehiclesList,
  });
};

export const useVehicleDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicleDetails(id),
    enabled: !!id,
  });
};

export const useAddVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData: IPostVehicle) => addVehicle(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVehiclePayload;
    }) => updateVehicle(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
    },
  });
};

export const useVehicleDriverHistoryQuery = (id: string) => {
  return useQuery({
    queryKey: ["vehicleDriverHistory", id],
    queryFn: () => getVehicleDriverHistory(id),
    enabled: !!id,
  });
};

export const useVehicleTripsQuery = (id: string) => {
  return useQuery({
    queryKey: ["vehicleTrips", id],
    queryFn: () => getVehicleTrips(id),
    enabled: !!id,
  });
};

export const useDriversListQuery = () => {
  return useQuery({
    queryKey: ["driversList"],
    queryFn: getDriversList,
  });
};

export const useAssignDriverMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignDriverPayload) =>
      assignDriverToVehicle(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle", variables.vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicleDriverHistory", variables.vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["driversList"] });
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
    },
  });
};

export const useUnassignDriverMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      vehicleId: string;
      driverId: string;
      reason?: string;
    }) => unassignDriverFromVehicle(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle", variables.vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicleDriverHistory", variables.vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["driversList"] });
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
    },
  });
};

// Aliases for backward compatibility
export const useVehicleQuery = useVehiclesQuery;
export const useAddVehicle = useAddVehicleMutation;
export const useUnassignDriver = useUnassignDriverMutation;
export const useVehicleDriverHistory = useVehicleDriverHistoryQuery;
export const useVehicleTrips = useVehicleTripsQuery;

export const useUpdateVehicle = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVehiclePayload) => updateVehicle(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
    },
  });
};

export { useAssignVehicleToDriver } from "../drivers/query";
