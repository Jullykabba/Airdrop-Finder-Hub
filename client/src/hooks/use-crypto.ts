import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCryptoPrices() {
  return useQuery({
    queryKey: [api.crypto.prices.path],
    queryFn: async () => {
      const res = await fetch(api.crypto.prices.path);
      if (!res.ok) throw new Error("Failed to fetch crypto prices");
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
