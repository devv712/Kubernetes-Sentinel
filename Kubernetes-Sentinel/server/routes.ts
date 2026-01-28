
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { nodes, pods, metrics, logs } from "@shared/schema";

// === SIMULATION ENGINE ===
// This runs in the background to generate fake metrics and handle chaos
function startSimulation() {
  setInterval(async () => {
    try {
      // 1. Generate Metrics
      const services = ["frontend", "backend", "database"];
      for (const svc of services) {
        // Base latency + random jitter
        const latency = 20 + Math.random() * 50; 
        await storage.addMetric({
          name: "http_request_duration_seconds",
          value: latency,
          labels: { service: svc }
        });

        // Request rate
        await storage.addMetric({
          name: "http_requests_total",
          value: Math.floor(Math.random() * 100),
          labels: { service: svc, status: "200" }
        });
        
        // Error rate (low by default)
        if (Math.random() > 0.95) {
           await storage.addMetric({
            name: "http_requests_total",
            value: Math.floor(Math.random() * 5),
            labels: { service: svc, status: "500" }
          });
        }
      }

      // 2. Process Chaos Experiments
      const runningExperiments = (await storage.getChaosExperiments()).filter(e => e.status === "running");
      
      for (const exp of runningExperiments) {
        // Check if expired
        const startTime = new Date(exp.startedAt!).getTime();
        const durationMs = (exp.duration || 30) * 1000;
        if (Date.now() - startTime > durationMs) {
          await storage.updateChaosStatus(exp.id, "completed");
          // Heal the system
          const allPods = await storage.getPods();
          for (const pod of allPods) {
            if (pod.status !== "Running") {
              await storage.updatePodStatus(pod.id, "Running", (pod.restarts || 0) + 1);
              await storage.addLog({
                level: "info",
                service: "kube-scheduler",
                message: `Self-healing: Restarted pod ${pod.name}`
              });
            }
          }
          continue;
        }

        // Apply chaos effect
        if (exp.type === "pod-kill") {
          const targetPods = (await storage.getPods()).filter(p => p.service === exp.targetService && p.status === "Running");
          if (targetPods.length > 0) {
            const victim = targetPods[Math.floor(Math.random() * targetPods.length)];
            await storage.updatePodStatus(victim.id, "CrashLoopBackOff");
            await storage.addLog({
              level: "error",
              service: "kubelet",
              message: `Liveness probe failed for ${victim.name}. Container killed.`
            });
          }
        }
      }

    } catch (e) {
      console.error("Simulation error:", e);
    }
  }, 5000); // Run every 5 seconds
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed initial data
  await storage.seedInfrastructure();
  
  // Start the background simulation
  startSimulation();

  // === APP ROUTES ===
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input.items);
      
      // Generate some traffic logs
      await storage.addLog({
        level: "info",
        service: "frontend",
        message: `Order created: #${order.id}. Total: $${order.total}`
      });
      
      res.status(201).json({ id: order.id, status: order.status });
    } catch (err) {
      res.status(400).json({ message: "Invalid order" });
    }
  });

  // === INFRASTRUCTURE ROUTES ===
  app.get(api.infrastructure.nodes.path, async (req, res) => {
    const nodes = await storage.getNodes();
    res.json(nodes);
  });

  app.get(api.infrastructure.pods.path, async (req, res) => {
    const pods = await storage.getPods();
    res.json(pods);
  });

  // === OBSERVABILITY ROUTES ===
  app.get(api.infrastructure.metrics.path, async (req, res) => {
    const metrics = await storage.getMetrics(
      req.query.name as string,
      req.query.range as string
    );
    res.json(metrics);
  });

  app.get(api.infrastructure.logs.path, async (req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.get(api.infrastructure.alerts.path, async (req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  // === CHAOS ROUTES ===
  app.get(api.chaos.list.path, async (req, res) => {
    const experiments = await storage.getChaosExperiments();
    res.json(experiments);
  });

  app.post(api.chaos.trigger.path, async (req, res) => {
    try {
      const input = api.chaos.trigger.input.parse(req.body);
      const experiment = await storage.createChaosExperiment(input);
      
      await storage.addLog({
        level: "warn",
        service: "chaos-controller",
        message: `Chaos Experiment Started: ${input.title} (${input.type}) on ${input.targetService}`
      });
      
      res.status(201).json(experiment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to trigger chaos" });
    }
  });

  return httpServer;
}
