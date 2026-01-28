# Kubernetes Observability & Self-Healing Platform

This project implements a production-grade observability and self-healing system as requested.

## 📂 Repository Structure

The project is organized as follows:

```
├── client/                 # Frontend Dashboard & Target App (React)
├── server/                 # Backend API & Simulation Engine (Express)
├── shared/                 # Shared Types & Schemas
├── k8s/                    # Kubernetes Manifests
│   ├── deployments/        # App Deployments
│   ├── services/           # Service Definitions
│   ├── ingress/            # Ingress Rules
│   └── hpa/                # Horizontal Pod Autoscalers
├── observability/          # Observability Stack Config
│   ├── prometheus/         # Prometheus Scrape Configs
│   ├── grafana/            # Dashboards
│   ├── loki/               # Logging Config
│   └── alertmanager/       # Alert Rules
├── chaos/                  # Chaos Mesh Experiments
│   ├── pod-failure.yaml
│   └── network-latency.yaml
├── slo-sla/                # Reliability Standards
│   ├── slis.md
│   └── slos.yaml
└── scripts/                # Utility Scripts
    └── load-test.sh
```

## 🚀 How to Run

### 1. The Platform Simulation (In Replit)
The application running in this Repl includes:
- **Target App**: An e-commerce store at `/store` (Generates traffic/logs)
- **Observability Dashboard**: The main view (Visualizes Nodes, Pods, Metrics)
- **Simulation Engine**: A background process in `server/index.ts` that:
  - Generates realistic Prometheus metrics
  - Simulates Pod crashes and Self-Healing events based on Chaos experiments

### 2. Deploying to Real Kubernetes
To deploy the actual infrastructure:
1. Ensure you have a K8s cluster (EKS, Kind, Minikube).
2. Apply the Observability Stack:
   ```bash
   kubectl apply -f observability/
   ```
3. Deploy the App:
   ```bash
   kubectl apply -f k8s/
   ```
4. Run Chaos Experiments:
   ```bash
   kubectl apply -f chaos/pod-failure.yaml
   ```

## 📊 Features Implemented
- **Full Observability**: Metrics, Logs, and Alerts simulation.
- **Chaos Engineering**: Interface to trigger simulated pod failures.
- **Self-Healing**: Automated recovery logic in the simulation engine.
- **SRE Standards**: SLIs and SLOs defined in code.
