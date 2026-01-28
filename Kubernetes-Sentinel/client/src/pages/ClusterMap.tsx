import { useNodes, usePods } from "@/hooks/use-observability";
import { StatusBadge } from "@/components/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Box, Cpu } from "lucide-react";
import clsx from "clsx";

export default function ClusterMap() {
  const { data: nodes, isLoading: loadingNodes } = useNodes();
  const { data: pods } = usePods();

  if (loadingNodes) return <div className="p-8 text-center text-muted-foreground">Scanning cluster topology...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold">Cluster Topology</h2>
          <p className="text-muted-foreground">Visual map of nodes and pod distribution.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" /> Running
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" /> CrashLoop
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" /> Pending
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        {nodes?.map((node) => {
          const nodePods = pods?.filter(p => p.nodeId === node.id) || [];
          
          return (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={clsx(
                "glass-panel rounded-2xl p-6 border-2 relative overflow-hidden flex flex-col min-h-[300px]",
                node.status === "Ready" ? "border-border" : "border-rose-500/50 bg-rose-950/10"
              )}
            >
              {/* Node Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{node.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{node.region}</span>
                      <span>•</span>
                      <span className="font-mono">{node.isMaster ? 'Master' : 'Worker'}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={node.status} />
              </div>

              {/* Resources */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background/40 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> CPU
                    </span>
                    <span className="text-xs font-mono">{node.cpuUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={clsx("h-full transition-all duration-1000", 
                        node.cpuUsage > 80 ? "bg-rose-500" : "bg-primary"
                      )}
                      style={{ width: `${node.cpuUsage}%` }} 
                    />
                  </div>
                </div>
                <div className="bg-background/40 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Memory</span>
                    <span className="text-xs font-mono">{node.memoryUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={clsx("h-full transition-all duration-1000", 
                        node.memoryUsage > 80 ? "bg-amber-500" : "bg-purple-500"
                      )}
                      style={{ width: `${node.memoryUsage}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Pod Grid */}
              <div className="flex-1 bg-black/20 rounded-xl p-4 inner-shadow">
                <div className="text-xs font-medium text-muted-foreground mb-3 flex justify-between">
                  <span>Running Pods ({nodePods.length})</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <AnimatePresence>
                    {nodePods.map(pod => (
                      <PodBox key={pod.id} pod={pod} />
                    ))}
                  </AnimatePresence>
                  {/* Empty slots visualizer */}
                  {Array.from({ length: Math.max(0, 12 - nodePods.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-md border border-white/5 bg-transparent" />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PodBox({ pod }: { pod: any }) {
  const statusColors = {
    Running: "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    Pending: "bg-amber-500 border-amber-400 animate-pulse",
    CrashLoopBackOff: "bg-rose-500 border-rose-400 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]",
    Terminating: "bg-gray-500 border-gray-400 opacity-50",
    Unknown: "bg-purple-500 border-purple-400",
  };

  const colorClass = statusColors[pod.status as keyof typeof statusColors] || statusColors.Unknown;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={clsx(
        "aspect-square rounded-md border flex flex-col items-center justify-center p-1 relative group cursor-help transition-colors duration-300",
        "bg-card hover:bg-card/80 border-border"
      )}
    >
      <div className={clsx("w-2.5 h-2.5 rounded-full mb-1", colorClass)} />
      <span className="text-[9px] font-mono text-muted-foreground truncate w-full text-center">
        {pod.service.slice(0, 3)}
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-popover border border-border p-2 rounded shadow-xl text-xs z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        <div className="font-bold mb-1">{pod.name}</div>
        <div className="text-muted-foreground">{pod.status}</div>
        <div className="mt-1 font-mono text-[10px] text-muted-foreground">
          R: {pod.restarts}
        </div>
      </div>
    </motion.div>
  );
}
