# Kubernetes-Sentinel: Kubernetes observability and self-healing platform using Prometheus, Grafana, Loki, Alertmanager, HPA, autoscaling, and chaos engineering to ensure high availability and reliability.

Project Overview:
This project implements a production-grade Kubernetes Observability and Self-Healing System designed to monitor, detect, and automatically recover from failures in a cloud-native environment. A Kubernetes cluster is deployed and instrumented using Prometheus for metrics collection, Grafana for visualization, and Loki for centralized logging, with all components managed via Helm for scalability and maintainability.

Architecture & Monitoring
The system continuously tracks cluster, node, pod, and application-level metrics including resource utilization, latency, error rates, and availability. Alertmanager is configured with SLA-driven alerts to detect pod crashes, node failures, high latency, and resource exhaustion, enabling rapid incident detection and response.

Self-Healing & Reliability
Self-healing is achieved through Kubernetes liveness and readiness probes, Horizontal Pod Autoscaler for traffic-based scaling, cluster autoscaler for node replacement, and service/ingress-based traffic rerouting to maintain uninterrupted availability.

Resilience Testing & SRE Practices
To validate reliability, Chaos Engineering is introduced using Chaos Mesh or Litmus to simulate pod, node, and network failures. SLOs and SLIs are defined using Prometheus metrics to continuously measure system reliability, availability, and performance, demonstrating strong alignment with modern SRE and DevOps best practices.

High-Level Architecture:
Users
  |
Ingress (NGINX / ALB)
  |
Kubernetes Cluster (EKS / kind / kubeadm)
  |
Microservices Application
  |
------------------------------------------------
|            Observability Stack               |
|                                              |
|  - Prometheus (Metrics Collection)           |
|  - Grafana (Visualization & Dashboards)      |
|  - Loki (Centralized Logging)                |
|  - Alertmanager (Alerting & Notifications)   |
------------------------------------------------

Self-Healing & Reliability Mechanisms
- Kubernetes pod auto-restart (liveness/readiness probes)
- Horizontal Pod Autoscaler (HPA)
- Cluster Autoscaler (node scaling & replacement)
- Node auto-recovery
- Traffic rerouting via Services / Ingress
- Chaos Engineering for resilience testing

Repository Structure:
Kubernetes-Sentinel/
│
├── app/
│   ├── frontend/                # Frontend microservice (UI layer)
│   └── backend/                 # Backend microservice (API/business logic)
│
├── k8s/
│   ├── deployments/             # Kubernetes Deployment manifests
│   ├── services/                # ClusterIP / NodePort / LoadBalancer services
│   ├── ingress/                 # Ingress resources (NGINX / ALB)
│   ├── hpa/                     # Horizontal Pod Autoscaler configurations
│   └── pdb/                     # Pod Disruption Budgets for high availability
│
├── observability/
│   ├── prometheus/              # Prometheus setup and scrape configs
│   ├── grafana/
│   │   └── dashboards/          # Custom Grafana dashboards (JSON)
│   ├── loki/                    # Centralized logging configuration
│   └── alertmanager/            # Alert rules and notification policies
│
├── chaos/
│   ├── pod-failure.yaml         # Chaos experiment: pod failure injection
│   ├── node-failure.yaml        # Chaos experiment: node failure simulation
│   └── network-latency.yaml     # Chaos experiment: network delay testing
│
├── slo-sla/
│   ├── slis.md                  # Service Level Indicators definition
│   ├── slos.yaml                # Service Level Objectives configuration
│   └── error-budget.md          # Error budget calculation and policies
│
├── scripts/
│   └── load-test.sh             # Load testing script to validate scaling & SLOs
│
└── README.md                    # Project documentation and architecture
