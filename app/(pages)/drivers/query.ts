import { IDriver } from '@/app/types'
import { useQuery } from '@tanstack/react-query'

const useDriverQuery = () => {
  return useQuery<IDriver[]>({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/c/b22a-b329-4fe3-bf36')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    }
  }
    
  )
}

export default useDriverQuery