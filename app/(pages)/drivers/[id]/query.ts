import { IDriver, Driver } from "@/app/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const useDriverDetailsQuery = ({id}:{id: string}) => {
    const queryClient = useQueryClient();
  return useQuery<Driver | undefined>({
    queryKey: ["driver", id],
    queryFn: async () => {
      // Replace with actual data fetching logic
      const response = await fetch("https://dummyjson.com/c/ac57-fa9b-49e8-8b6"); //intensionally wrong url to test error handling put "c" at the end of url
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Driver;
    },
    initialData: () => {
        const driversResponse = queryClient.getQueryData<IDriver>(["Drivers"]);
        const list = driversResponse?.dto?.content || [];
        return list.find((driver) => String(driver.id) === id);
    },
    enabled: !!id,
  }
  )
}

export default useDriverDetailsQuery