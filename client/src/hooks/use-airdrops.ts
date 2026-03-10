import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useAirdrops(params?: z.infer<typeof api.airdrops.list.input>) {
  return useQuery({
    queryKey: [api.airdrops.list.path, params],
    queryFn: async () => {
      const url = new URL(api.airdrops.list.path, window.location.origin);
      if (params?.network) url.searchParams.set('network', params.network);
      if (params?.search) url.searchParams.set('search', params.search);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch airdrops");
      
      const data = await res.json();
      return parseWithLogging(api.airdrops.list.responses[200], data, "airdrops.list");
    },
  });
}

export function useCreateAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.airdrops.create.input>) => {
      const payload = api.airdrops.create.input.parse(data);
      const res = await fetch(api.airdrops.create.path, {
        method: api.airdrops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create airdrop");
      const json = await res.json();
      return parseWithLogging(api.airdrops.create.responses[201], json, "airdrops.create");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.airdrops.list.path] }),
  });
}

export function useUpdateAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & z.infer<typeof api.airdrops.update.input>) => {
      const payload = api.airdrops.update.input.parse(data);
      const url = buildUrl(api.airdrops.update.path, { id });
      
      const res = await fetch(url, {
        method: api.airdrops.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update airdrop");
      const json = await res.json();
      return parseWithLogging(api.airdrops.update.responses[200], json, "airdrops.update");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.airdrops.list.path] }),
  });
}

export function useDeleteAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.airdrops.delete.path, { id });
      const res = await fetch(url, {
        method: api.airdrops.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete airdrop");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.airdrops.list.path] }),
  });
}
