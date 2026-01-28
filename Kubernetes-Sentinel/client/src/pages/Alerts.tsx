import { useAlerts } from "@/hooks/use-observability";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertOctagon, CheckCircle, Bell } from "lucide-react";

export default function Alerts() {
  const { data: alerts } = useAlerts();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold">AlertManager</h2>
        <p className="text-muted-foreground">Active firing alerts and incident history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="p-3 bg-rose-500/20 rounded-full">
            <AlertOctagon className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{alerts?.filter(a => a.status === 'firing').length || 0}</div>
            <div className="text-sm text-muted-foreground">Firing Alerts</div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-500/20 rounded-full">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{alerts?.filter(a => a.status === 'resolved').length || 0}</div>
            <div className="text-sm text-muted-foreground">Resolved Today</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alert Stream
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {alerts?.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-white/5 transition-colors flex items-start gap-4">
               <div className={`mt-1 h-2 w-2 rounded-full ${alert.status === 'firing' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                   <h4 className="font-bold text-base">{alert.title}</h4>
                   <span className="text-xs text-muted-foreground font-mono">
                     {alert.createdAt && new Date(alert.createdAt).toLocaleString()}
                   </span>
                 </div>
                 <p className="text-muted-foreground text-sm mb-3">{alert.description}</p>
                 <div className="flex gap-2">
                   <StatusBadge status={alert.severity} />
                   <StatusBadge status={alert.status} />
                 </div>
               </div>
            </div>
          ))}
          {!alerts?.length && (
            <div className="p-12 text-center text-muted-foreground">
              No alerts found. Cluster operating normally.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
