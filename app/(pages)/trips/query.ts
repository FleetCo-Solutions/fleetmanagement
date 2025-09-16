import { getTrips, addTrip, AddTripPayload } from "@/actions/trips"
import { ITrips } from "@/app/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTripsQuery = () => {
    return useQuery<ITrips>({
        queryKey: ['Trips'],
        queryFn: async () => await getTrips()
    })
}   

export const useAddTrip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['AddTrip'],
        mutationFn: async (tripData: AddTripPayload) => await addTrip(tripData),

        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['Trips'] })
        }
    })
}