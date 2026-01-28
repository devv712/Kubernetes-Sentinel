import { useMetrics } from "@/hooks/use-observability";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Loader2 } from "lucide-react";

export default function Metrics() {
  const { data: requests, isLoading: loadingReq } = useMetrics("http_requests_total");
  const { data: cpu, isLoading: loadingCpu } = useMetrics("cpu_usage");
  const { data: memory, isLoading: loadingMem } = useMetrics("memory_usage");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold">Metrics & Analytics</h2>
        <p className="text-muted-foreground">Prometheus time-series data visualization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Volume */}
        <MetricCard title="Request Volume (RPS)" data={requests} color="hsl(var(--primary))" loading={loadingReq} />
        
        {/* Error Rate */}
        <MetricCard title="Error Rate (%)" data={[]} color="hsl(var(--destructive))" loading={false} empty />

        {/* CPU Usage */}
        <MetricCard title="Cluster CPU Usage" data={cpu} color="hsl(262, 83%, 58%)" loading={loadingCpu} />

        {/* Memory Usage */}
        <MetricCard title="Cluster Memory Usage" data={memory} color="hsl(142, 71%, 45%)" loading={loadingMem} />
      </div>
    </div>
  );
}

function MetricCard({ title, data, color, loading, empty }: any) {
  return (
    <div className="glass-panel p-6 rounded-xl">
      <h3 className="font-bold mb-6">{title}</h3>
      <div className="h-[300px] w-full flex items-center justify-center bg-black/20 rounded-lg border border-white/5">
        {loading ? (
          <Loader2 className="animate-spin text-muted-foreground" />
        ) : empty ? (
          <div className="text-muted-foreground text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} 
                tickFormatter={(val) => new Date(val).toLocaleTimeString()}
                stroke="transparent"
              />
              <YAxis 
                tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} 
                stroke="transparent"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                labelFormatter={(val) => new Date(val).toLocaleTimeString()}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#gradient-${title})`} 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
