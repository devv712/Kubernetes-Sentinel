import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertChaosExperiment } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

// === INFRASTRUCTURE ===

export function useNodes() {
  return useQuery({
    queryKey: [api.infrastructure.nodes.path],
    queryFn: async () => {
      const res = await fetch(api.infrastructure.nodes.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch nodes");
      return api.infrastructure.nodes.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Real-time pulse
  });
}

export function usePods() {
  return useQuery({
    queryKey: [api.infrastructure.pods.path],
    queryFn: async () => {
      const res = await fetch(api.infrastructure.pods.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pods");
      return api.infrastructure.pods.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Fast updates for pod movements
  });
}

// === METRICS & LOGS ===

export function useMetrics(name?: string, range?: '1h' | '6h' | '24h') {
  return useQuery({
    queryKey: [api.infrastructure.metrics.path, { name, range }],
    queryFn: async () => {
      // Build URL with params manually since we don't have a helper for query params in URL yet
      // In a real app we'd use URLSearchParams
      const url = new URL(api.infrastructure.metrics.path, window.location.origin);
      if (name) url.searchParams.append('name', name);
      if (range) url.searchParams.append('range', range);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.infrastructure.metrics.responses[200].parse(await res.json());
    },
    refetchInterval: 3000,
  });
}

export function useLogs(service?: string, level?: string) {
  return useQuery({
    queryKey: [api.infrastructure.logs.path, { service, level }],
    queryFn: async () => {
      const url = new URL(api.infrastructure.logs.path, window.location.origin);
      if (service) url.searchParams.append('service', service);
      if (level) url.searchParams.append('level', level);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.infrastructure.logs.responses[200].parse(await res.json());
    },
    refetchInterval: 2000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: [api.infrastructure.alerts.path],
    queryFn: async () => {
      const res = await fetch(api.infrastructure.alerts.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return api.infrastructure.alerts.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
  });
}

// === CHAOS EXPERIMENTS ===

export function useChaosExperiments() {
  return useQuery({
    queryKey: [api.chaos.list.path],
    queryFn: async () => {
      const res = await fetch(api.chaos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch experiments");
      return api.chaos.list.responses[200].parse(await res.json());
    },
  });
}

export function useTriggerChaos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertChaosExperiment) => {
      const res = await apiRequest("POST", api.chaos.trigger.path, data);
      return api.chaos.trigger.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chaos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.infrastructure.pods.path] }); // Expect pod death
      queryClient.invalidateQueries({ queryKey: [api.infrastructure.alerts.path] }); // Expect alerts
    },
  });
}
