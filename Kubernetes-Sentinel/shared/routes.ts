
import { z } from 'zod';
import { 
  insertProductSchema, 
  insertOrderSchema,
  insertChaosSchema,
  products,
  nodes,
  pods,
  chaosExperiments,
  alerts,
  logs,
  metrics
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === TARGET APP ENDPOINTS ===
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number()
        }))
      }),
      responses: {
        201: z.object({ id: z.number(), status: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },

  // === OBSERVABILITY ENDPOINTS ===
  infrastructure: {
    nodes: {
      method: 'GET' as const,
      path: '/api/infrastructure/nodes',
      responses: {
        200: z.array(z.custom<typeof nodes.$inferSelect>()),
      },
    },
    pods: {
      method: 'GET' as const,
      path: '/api/infrastructure/pods',
      responses: {
        200: z.array(z.custom<typeof pods.$inferSelect>()),
      },
    },
    metrics: {
      method: 'GET' as const,
      path: '/api/observability/metrics',
      input: z.object({
        range: z.enum(['1h', '6h', '24h']).optional(),
        name: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof metrics.$inferSelect>()),
      },
    },
    logs: {
      method: 'GET' as const,
      path: '/api/observability/logs',
      input: z.object({
        service: z.string().optional(),
        level: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>()),
      },
    },
    alerts: {
      method: 'GET' as const,
      path: '/api/observability/alerts',
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
  },

  // === CHAOS ENDPOINTS ===
  chaos: {
    list: {
      method: 'GET' as const,
      path: '/api/chaos',
      responses: {
        200: z.array(z.custom<typeof chaosExperiments.$inferSelect>()),
      },
    },
    trigger: {
      method: 'POST' as const,
      path: '/api/chaos/trigger',
      input: insertChaosSchema,
      responses: {
        201: z.custom<typeof chaosExperiments.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
