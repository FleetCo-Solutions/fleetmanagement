import {
  getTrips,
  getTripById,
  addTrip,
  updateTrip,
  deleteTrip,
  CreateTripPayload,
  UpdateTripPayload,
  Trip,
} from "@/actions/trips";
import { TripDetails, TripsList } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useTripsQuery = () => {
  return useQuery<TripsList>({
    queryKey: ["Trips"],
    queryFn: async () => await getTrips(),
  });
};

export const useTripByIdQuery = (id: string) => {
  return useQuery<TripDetails>({
    queryKey: ["Trip", id],
    queryFn: async () => await getTripById(id),
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
