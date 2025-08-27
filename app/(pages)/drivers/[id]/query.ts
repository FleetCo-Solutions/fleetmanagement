import { IDriver } from "@/app/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const useDriverDetailsQuery = ({id}:{id: string}) => {
    const queryClient = useQueryClient();
  return useQuery<IDriver>({
    queryKey: ["driver", id],
    queryFn: async () => {
      // Replace with actual data fetching logic
      const response = await fetch("https://dummyjson.com/c/ac57-fa9b-49e8-8b6"); //intensionally wrong url to test error handling put "c" at the end of url
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    initialData: () => {
        const drivers = queryClient.getQueryData<IDriver[]>(['drivers']);
        return drivers?.find(driver => driver.driverId === id);
    },
    enabled: !!id,
  }
  )
}

export default useDriverDetailsQuery