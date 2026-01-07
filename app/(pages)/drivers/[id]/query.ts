import { getDriverDetails, getDriverVehicleHistory, UpdateDriverPayload } from "@/actions/drivers";
import {
  addEmergencyContact,
  updateEmergencyContact as updateAction,
  deleteEmergencyContact as deleteAction,
} from "@/actions/emergencyContact";
import { IndividualDriver, EmergencyContactPayload } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDriverDetailsQuery = ({ id }: { id: string }) => {
  return useQuery<IndividualDriver>({
    queryKey: ["driver", id],
    queryFn: async () => await getDriverDetails(id),
  });
};

export const usePostEmergencyContact = (driverId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (EmergencyContactPayload: EmergencyContactPayload) =>
      await addEmergencyContact(EmergencyContactPayload),
    onSettled: () => {
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      } else {
        // Fallback or invalidate all drivers if needed, but specific is better
        queryClient.invalidateQueries({ queryKey: ["driver"] });
      }
    },
  });
};

export const useUpdateEmergencyContact = (driverId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: EmergencyContactPayload;
    }) => await updateAction(id, payload),
    onSettled: () => {
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["driver"] });
      }
    },
  });
};

export const useDeleteEmergencyContact = (driverId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["EmergencyContact"],
    mutationFn: async (id: string) => await deleteAction(id),
    onSettled: () => {
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["driver"] });
      }
    },
  });
};

export const useUpdateDriver = (driverId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateDriver"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDriverPayload;
    }) => {
      const { updateDriver } = await import("@/actions/drivers");
      return await updateDriver(id, payload);
    },
    onSettled: () => {
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      }
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useDriverVehicleHistory = (driverId: string) => {
  return useQuery({
    queryKey: ["driverVehicleHistory", driverId],
    queryFn: async () => await getDriverVehicleHistory(driverId),
    enabled: !!driverId,
  });
};

export const useDriverTrips = (driverId: string) => {
  return useQuery({
    queryKey: ["driverTrips", driverId],
    queryFn: async () => {
      const { getDriverTrips } = await import("@/actions/drivers");
      return await getDriverTrips(driverId);
    },
    enabled: !!driverId,
  });
};
