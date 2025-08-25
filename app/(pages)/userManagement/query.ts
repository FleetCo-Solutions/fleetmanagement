import { IUser } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

const useUserQuery = () => {
  return useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/c/9bbb-b679-4330-ab0f`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

export default useUserQuery;
