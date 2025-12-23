import {
  getMaintenanceRecords,
  addMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  CreateMaintenancePayload,
  UpdateMaintenancePayload,
  getMaintenanceRecordById,
} from "@/actions/maintenance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MaintenanceApiResponse,
  MaintenanceDetailResponse,
  MaintenanceRecord,
} from "@/app/types";

export const useMaintenanceRecordsQuery = () => {
  return useQuery<MaintenanceApiResponse>({
    queryKey: ["MaintenanceRecords"],
    queryFn: async () => await getMaintenanceRecords(),
  });
};

export const useMaintenanceRecordByIdQuery = (id: string) => {
  return useQuery<MaintenanceDetailResponse>({
    queryKey: ["MaintenanceRecordById"],
    queryFn: async () => await getMaintenanceRecordById(id),
  });
};

export const useAddMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addMaintenanceRecord"],
    mutationFn: async (data: CreateMaintenancePayload) =>
      await addMaintenanceRecord(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MaintenanceRecords"] });
    },
  });
};

export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMaintenanceRecord"],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaintenancePayload;
    }) => await updateMaintenanceRecord(id, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MaintenanceRecords"] });
    },
  });
};

export const useDeleteMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMaintenanceRecord"],
    mutationFn: async (id: string) => await deleteMaintenanceRecord(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MaintenanceRecords"] });
    },
  });
};

import { getVehiclesList } from "@/actions/vehicles";
import { VehiclesList } from "@/app/types";

export const useVehiclesListQuery = () => {
  return useQuery<VehiclesList>({
    queryKey: ["VehiclesList"],
    queryFn: async () => await getVehiclesList(),
  });
};
