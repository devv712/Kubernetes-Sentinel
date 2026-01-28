import { useNodes, usePods, useAlerts, useMetrics } from "@/hooks/use-observability";
import { StatusBadge } from "@/components/StatusBadge";
import { Activity, Server, Box, AlertOctagon, CheckCircle2, Cpu } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Dashboard() {
  const { data: nodes } = useNodes();
  const { data: pods } = usePods();
  const { data: alerts } = useAlerts();
  const { data: metrics } = useMetrics("http_requests_total", "1h");

  // Calculations
  const totalPods = pods?.length || 0;
  const runningPods = pods?.filter(p => p.status === "Running").length || 0;
  const healthScore = totalPods > 0 ? Math.round((runningPods / totalPods) * 100) : 100;
  const activeAlerts = alerts?.filter(a => a.status === "firing").length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold">Platform Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time cluster health and performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard 
          label="Cluster Health" 
          value={`${healthScore}%`} 
          icon={Activity} 
          trend={healthScore > 90 ? "Healthy" : "Degraded"}
          trendColor={healthScore > 90 ? "text-emerald-400" : "text-rose-400"}
        />
        <KpiCard 
          label="Active Alerts" 
          value={activeAlerts} 
          icon={AlertOctagon} 
          trend={activeAlerts === 0 ? "All Clear" : "Critical"}
          trendColor={activeAlerts === 0 ? "text-emerald-400" : "text-rose-400"}
        />
        <KpiCard 
          label="Nodes Online" 
          value={nodes?.filter(n => n.status === "Ready").length || 0} 
          subValue={`/ ${nodes?.length || 0} Total`}
          icon={Server} 
          trend="Stable"
          trendColor="text-blue-400"
        />
        <KpiCard 
          label="Active Pods" 
          value={runningPods} 
          subValue={`/ ${totalPods} Total`}
          icon={Box} 
          trend="Scaling"
          trendColor="text-emerald-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-rose-500">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-rose-500" />
              Active Incidents
            </h3>
            <div className="space-y-3">
              {alerts?.filter(a => a.status === 'firing').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                  <CheckCircle2 className="h-12 w-12 mb-2" />
                  <p>No active incidents</p>
                </div>
              ) : (
                alerts?.filter(a => a.status === 'firing').map(alert => (
                  <div key={alert.id} className="bg-background/50 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{alert.title}</span>
                      <StatusBadge status={alert.severity} />
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              Resource Usage
            </h3>
            <div className="space-y-4">
              {nodes?.map(node => (
                <div key={node.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{node.name}</span>
                    <span className="font-mono text-muted-foreground">{node.cpuUsage}% CPU</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${node.cpuUsage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Traffic & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-bold mb-6">HTTP Traffic (Last Hour)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-bold mb-2 text-sm text-muted-foreground">Frontend Latency</h3>
              <div className="text-2xl font-mono font-bold">45ms</div>
              <div className="mt-2 text-xs text-emerald-400">Avg response time normal</div>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold mb-2 text-sm text-muted-foreground">Error Rate</h3>
                  <div className="text-2xl font-mono font-bold text-emerald-400">0.02%</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Within SLO (99.9%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, subValue, icon: Icon, trend, trendColor }: any) {
  return (
    <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-24 w-24" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold tracking-tight">{value}</span>
          {subValue && <span className="text-sm text-muted-foreground">{subValue}</span>}
        </div>
        <div className={clsx("mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-block bg-background/50", trendColor)}>
          {trend}
        </div>
      </div>
    </div>
  );
}
