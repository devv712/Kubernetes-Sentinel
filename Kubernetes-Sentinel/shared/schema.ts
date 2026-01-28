
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TARGET APP SCHEMA (E-Commerce) ===

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(), // Static asset path
  stock: integer("stock").notNull().default(100),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// === OBSERVABILITY & INFRASTRUCTURE SCHEMA (Simulation) ===

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "worker-1"
  region: text("region").notNull().default("us-east-1"),
  status: text("status").notNull().default("Ready"), // Ready, NotReady, Unknown
  cpuUsage: integer("cpu_usage").notNull().default(0), // Percentage 0-100
  memoryUsage: integer("memory_usage").notNull().default(0), // Percentage 0-100
  isMaster: boolean("is_master").default(false),
});

export const pods = pgTable("pods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "frontend-7d8b9c"
  namespace: text("namespace").notNull().default("default"),
  nodeId: integer("node_id"), // Nullable if pending
  service: text("service").notNull(), // frontend, backend, database, redis
  status: text("status").notNull().default("Running"), // Running, Pending, CrashLoopBackOff, Terminating
  restarts: integer("restarts").default(0),
  cpuRequest: integer("cpu_request").default(100), // mCPU
  memoryRequest: integer("memory_request").default(128), // MiB
  createdAt: timestamp("created_at").defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  name: text("name").notNull(), // http_requests_total, cpu_usage, memory_usage
  value: doublePrecision("value").notNull(),
  labels: jsonb("labels"), // { service: "frontend", code: "200" }
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  level: text("level").notNull(), // info, warn, error
  service: text("service").notNull(),
  message: text("message").notNull(),
});

export const chaosExperiments = pgTable("chaos_experiments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Pod Failure - Frontend"
  type: text("type").notNull(), // pod-kill, network-latency, cpu-stress
  targetService: text("target_service").notNull(),
  status: text("status").notNull().default("idle"), // idle, running, completed
  duration: integer("duration").default(30), // seconds
  startedAt: timestamp("started_at"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  severity: text("severity").notNull(), // critical, warning
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("firing"), // firing, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// === ZOD SCHEMAS ===

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertNodeSchema = createInsertSchema(nodes).omit({ id: true });
export const insertPodSchema = createInsertSchema(pods).omit({ id: true, createdAt: true });
export const insertChaosSchema = createInsertSchema(chaosExperiments).omit({ id: true, status: true, startedAt: true });

// === TYPES ===

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Node = typeof nodes.$inferSelect;
export type Pod = typeof pods.$inferSelect;
export type Metric = typeof metrics.$inferSelect;
export type Log = typeof logs.$inferSelect;
export type ChaosExperiment = typeof chaosExperiments.$inferSelect;
export type Alert = typeof alerts.$inferSelect;

export type InsertChaosExperiment = z.infer<typeof insertChaosSchema>;
