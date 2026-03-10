import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

function getWalletHeader() {
  const stored = localStorage.getItem("userWallet");
  return stored ? { "x-wallet-address": stored } : {};
}

export function useAuth() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { 
        credentials: "include",
        headers: getWalletHeader()
      });
      if (res.status === 401) return null; // Not logged in
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return parseWithLogging(api.auth.me.responses[200], data, "auth.me");
    },
    staleTime: Infinity, // Profile doesn't change often
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (walletAddress: string) => {
      const payload = api.auth.login.input.parse({ walletAddress });
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Invalid wallet address");
        }
        throw new Error("Failed to login");
      }
      
      const data = await res.json();
      const user = res.status === 200 
        ? parseWithLogging(api.auth.login.responses[200], data, "auth.login(200)")
        : parseWithLogging(api.auth.login.responses[201], data, "auth.login(201)");
      
      // Store wallet address for future requests
      localStorage.setItem("userWallet", walletAddress);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: z.infer<typeof api.auth.update.input>) => {
      const payload = api.auth.update.input.parse(updates);
      const res = await fetch(api.auth.update.path, {
        method: api.auth.update.method,
        headers: { 
          "Content-Type": "application/json",
          ...getWalletHeader()
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      
      const data = await res.json();
      return parseWithLogging(api.auth.update.responses[200], data, "auth.update");
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
    },
  });
}

// Helper hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Clear local storage
      localStorage.removeItem("userWallet");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.clear();
      window.location.href = '/';
    }
  });
}
