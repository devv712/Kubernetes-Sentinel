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


<img width="719" height="590" alt="image" src="https://github.com/user-attachments/assets/39f0cdf0-db76-49ea-996d-5e6474e889eb" />


