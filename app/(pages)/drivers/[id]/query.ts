import { getDriverDetails, getDriverVehicleHistory } from "@/actions/drivers";
import {
  addEmergencyContact,
  updateEmergencyContact as updateAction,
  deleteEmergencyContact as deleteAction,
} from "@/actions/emergencyContact";
import {
  IndividualDriver,
  EmergencyContactPayload,
  IUpdateDriver,
} from "@/app/types";
import {
  getDriverDocuments,
  getDriverDocumentsSummary,
  uploadDriverDocument,
  updateDriverDocument,
  deleteDriverDocument,
} from "@/actions/documents";
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
      payload: IUpdateDriver;
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

export const useDriverDocumentsQuery = (driverId: string) => {
  return useQuery({
    queryKey: ["driverDocuments", driverId],
    queryFn: () => getDriverDocuments(driverId),
    enabled: !!driverId,
  });
};

export const useDriverDocumentsSummaryQuery = (driverId: string) => {
  return useQuery({
    queryKey: ["driverDocumentsSummary", driverId],
    queryFn: () => getDriverDocumentsSummary(driverId),
    enabled: !!driverId,
  });
};

export const useUploadDriverDocumentMutation = (driverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      uploadDriverDocument(driverId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["driverDocuments", driverId],
      });
      queryClient.invalidateQueries({
        queryKey: ["driverDocumentsSummary", driverId],
      });
    },
  });
};

export const useUpdateDriverDocumentMutation = (driverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, formData }: { docId: string; formData: FormData }) =>
      updateDriverDocument(driverId, docId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["driverDocuments", driverId],
      });
      queryClient.invalidateQueries({
        queryKey: ["driverDocumentsSummary", driverId],
      });
    },
  });
};

export const useDeleteDriverDocumentMutation = (driverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteDriverDocument(driverId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["driverDocuments", driverId],
      });
      queryClient.invalidateQueries({
        queryKey: ["driverDocumentsSummary", driverId],
      });
    },
  });
};
