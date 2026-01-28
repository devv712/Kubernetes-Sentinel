import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      const res = await fetch(api.products.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (items: { productId: number; quantity: number }[]) => {
      const res = await apiRequest("POST", api.orders.create.path, { items });
      return api.orders.create.responses[201].parse(await res.json());
    },
  });
}
