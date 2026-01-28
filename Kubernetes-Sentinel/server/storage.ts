
import { db } from "./db";
import { 
  products, orders, nodes, pods, metrics, logs, chaosExperiments, alerts,
  type Product, type Order, type Node, type Pod, type Metric, type Log, type ChaosExperiment, type Alert,
  type InsertChaosExperiment
} from "@shared/schema";
import { eq, desc, sql, lt } from "drizzle-orm";

export interface IStorage {
  // App
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createOrder(items: any[]): Promise<Order>; // Simplified for demo
  
  // Infra
  getNodes(): Promise<Node[]>;
  getPods(): Promise<Pod[]>;
  updatePodStatus(id: number, status: string, restarts?: number): Promise<Pod>;
  
  // Observability
  getMetrics(name?: string, range?: string): Promise<Metric[]>;
  addMetric(metric: any): Promise<void>;
  getLogs(service?: string, level?: string): Promise<Log[]>;
  addLog(log: any): Promise<void>;
  getAlerts(): Promise<Alert[]>;
  
  // Chaos
  getChaosExperiments(): Promise<ChaosExperiment[]>;
  createChaosExperiment(experiment: InsertChaosExperiment): Promise<ChaosExperiment>;
  updateChaosStatus(id: number, status: string): Promise<void>;
  
  // Init
  seedInfrastructure(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createOrder(items: any[]): Promise<Order> {
    const total = items.reduce((acc, item) => acc + (item.quantity * 10), 0); // Mock price
    const [order] = await db.insert(orders).values({ 
      total, 
      status: "completed" 
    }).returning();
    return order;
  }

  async getNodes(): Promise<Node[]> {
    return await db.select().from(nodes);
  }

  async getPods(): Promise<Pod[]> {
    return await db.select().from(pods);
  }

  async updatePodStatus(id: number, status: string, restarts?: number): Promise<Pod> {
    const updates: any = { status };
    if (restarts !== undefined) updates.restarts = restarts;
    
    const [pod] = await db.update(pods)
      .set(updates)
      .where(eq(pods.id, id))
      .returning();
    return pod;
  }

  async getMetrics(name?: string, range?: string): Promise<Metric[]> {
    let query = db.select().from(metrics).orderBy(desc(metrics.timestamp)).limit(100);
    // Real implementation would filter by name/range
    if (name) {
      query = db.select().from(metrics).where(eq(metrics.name, name)).orderBy(desc(metrics.timestamp)).limit(50);
    }
    return await query;
  }

  async addMetric(metric: any): Promise<void> {
    await db.insert(metrics).values(metric);
    // Cleanup old metrics to keep DB small for demo
    // In real app, we'd use retention policies
  }

  async getLogs(service?: string, level?: string): Promise<Log[]> {
    // Simplified filtering
    let query = db.select().from(logs).orderBy(desc(logs.timestamp)).limit(100);
    return await query;
  }

  async addLog(log: any): Promise<void> {
    await db.insert(logs).values(log);
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getChaosExperiments(): Promise<ChaosExperiment[]> {
    return await db.select().from(chaosExperiments).orderBy(desc(chaosExperiments.startedAt));
  }

  async createChaosExperiment(experiment: InsertChaosExperiment): Promise<ChaosExperiment> {
    const [exp] = await db.insert(chaosExperiments).values({
      ...experiment,
      status: "running",
      startedAt: new Date()
    }).returning();
    return exp;
  }

  async updateChaosStatus(id: number, status: string): Promise<void> {
    await db.update(chaosExperiments).set({ status }).where(eq(chaosExperiments.id, id));
  }

  async seedInfrastructure(): Promise<void> {
    const existingNodes = await this.getNodes();
    if (existingNodes.length === 0) {
      // Create Nodes
      const node1 = await db.insert(nodes).values({ name: "worker-pool-1", region: "us-east-1a", isMaster: false }).returning();
      const node2 = await db.insert(nodes).values({ name: "worker-pool-2", region: "us-east-1b", isMaster: false }).returning();
      const master = await db.insert(nodes).values({ name: "control-plane-1", region: "us-east-1a", isMaster: true }).returning();

      // Create Pods
      const services = ["frontend", "frontend", "backend", "backend", "database", "redis", "auth-service"];
      for (const svc of services) {
        const targetNode = svc === "database" ? node2[0] : (Math.random() > 0.5 ? node1[0] : node2[0]);
        await db.insert(pods).values({
          name: `${svc}-${Math.random().toString(36).substring(7)}`,
          nodeId: targetNode.id,
          service: svc,
          status: "Running"
        });
      }

      // Create Products
      await db.insert(products).values([
        { name: "Kubernetes The Hard Way", description: "A comprehensive guide to K8s internals.", price: 49.99, image: "book", stock: 50 },
        { name: "Prometheus Handbook", description: "Master observability with Prometheus.", price: 39.99, image: "book", stock: 100 },
        { name: "SRE Reliability Kit", description: "Tools for chaos engineering.", price: 199.99, image: "kit", stock: 20 },
        { name: "Cluster Autoscaler Plushie", description: "Cute plushie that scales up.", price: 24.99, image: "plushie", stock: 200 },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
