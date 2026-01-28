#!/bin/bash
# Simple load test script using Apache Bench (ab) or hey
# Usage: ./load-test.sh <url>

URL=${1:-http://localhost:5000/store}
echo "Starting load test against $URL..."

# Simulate 1000 requests with 10 concurrent users
# hey -n 1000 -c 10 $URL

# For demo purposes, just curl in a loop
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" $URL &
done
wait
echo "Load test complete."
