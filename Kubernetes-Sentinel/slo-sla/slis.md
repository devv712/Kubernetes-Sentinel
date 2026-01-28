# Service Level Indicators (SLIs)

## 1. Availability
**Definition**: The proportion of valid requests served successfully.
**Formula**: `(Successful Requests / Total Valid Requests) * 100`
**Metric**: `http_requests_total{status!~"5.."}` / `http_requests_total`

## 2. Latency
**Definition**: The proportion of requests served faster than a threshold.
**Formula**: `(Requests < 300ms) / Total Requests`
**Metric**: `http_request_duration_seconds_bucket{le="0.3"}`

## 3. Error Rate
**Definition**: The fraction of requests that result in a 5xx error.
**Formula**: `(5xx Requests / Total Requests) * 100`
**Metric**: `rate(http_requests_total{status=~"5.."}[5m])`
