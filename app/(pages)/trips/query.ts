import {
  getTrips,
  getTripById,
  addTrip,
  updateTrip,
  deleteTrip,
  CreateTripPayload,
  UpdateTripPayload,
  Trip,
  tripSummary,
  tripMachineLearning,
  getTripLatestLocation,
} from "@/actions/trips";
import {
  TripDetails,
  ITrips,
  TripSummary,
  NewTripDetails,
  FrankTripDetails,
} from "@/app/types";
import {
  getTripDocuments,
  getTripDocumentsSummary,
  uploadTripDocument,
  updateTripDocument,
  deleteTripDocument,
} from "@/actions/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTripsQuery = () => {
  return useQuery<ITrips>({
    queryKey: ["Trips"],
    queryFn: async () => await getTrips(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds for real-time updates
  });
};

export const useTripByIdQuery = (id: string) => {
  return useQuery<NewTripDetails>({
    queryKey: ["Trip", id],
    queryFn: async () => await getTripById(id),
    enabled: !!id,
  });
};

export const useTripSummaryQuery = (id: string) => {
  return useQuery<TripSummary>({
    queryKey: ["TripSummary", id],
    queryFn: async () => await tripSummary(id),
    enabled: !!id,
  });
};

export const useTripMachineLearningQuery = (id: string) => {
  return useQuery<FrankTripDetails>({
    queryKey: ["TripMachineLearning", id],
    queryFn: async () => await tripMachineLearning(id),
    enabled: !!id,
  });
};

export const useTripLocationQuery = (id: string) => {
  return useQuery({
    queryKey: ["tripLocation", id],
    queryFn: async () => {
      const result = await getTripLatestLocation(id);
      return result;
    },
    refetchInterval: 3000,
    retry: false,
    enabled: !!id,
  });
};

export const useAddTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["AddTrip"],
    mutationFn: async (tripData: CreateTripPayload) => await addTrip(tripData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Trips"] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UpdateTrip"],
    mutationFn: async ({ id, data }: { id: string; data: UpdateTripPayload }) =>
      await updateTrip(id, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Trips"] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["DeleteTrip"],
    mutationFn: async (id: string) => await deleteTrip(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Trips"] });
    },
  });
};

export const useTripDocumentsQuery = (tripId: string) => {
  return useQuery({
    queryKey: ["tripDocuments", tripId],
    queryFn: () => getTripDocuments(tripId),
    enabled: !!tripId,
  });
};

export const useTripDocumentsSummaryQuery = (tripId: string) => {
  return useQuery({
    queryKey: ["tripDocumentsSummary", tripId],
    queryFn: () => getTripDocumentsSummary(tripId),
    enabled: !!tripId,
  });
};

export const useUploadTripDocumentMutation = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadTripDocument(tripId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripDocuments", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripDocumentsSummary", tripId],
      });
    },
  });
};

export const useUpdateTripDocumentMutation = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, formData }: { docId: string; formData: FormData }) =>
      updateTripDocument(tripId, docId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripDocuments", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripDocumentsSummary", tripId],
      });
    },
  });
};

export const useDeleteTripDocumentMutation = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteTripDocument(tripId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripDocuments", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripDocumentsSummary", tripId],
      });
    },
  });
};
