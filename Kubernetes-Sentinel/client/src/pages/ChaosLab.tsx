import { useChaosExperiments, useTriggerChaos } from "@/hooks/use-observability";
import { Zap, Skull, Network, Cpu, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EXPERIMENTS = [
  {
    type: "pod-kill",
    title: "Pod Termination",
    description: "Randomly kill a pod from a target service to test self-healing resilience.",
    icon: Skull,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  {
    type: "network-latency",
    title: "Network Latency",
    description: "Inject 2000ms latency into the network layer for specific services.",
    icon: Network,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    type: "cpu-stress",
    title: "CPU Pressure",
    description: "Max out CPU usage on a random node to trigger autoscaling.",
    icon: Cpu,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  }
];

export default function ChaosLab() {
  const { data: history } = useChaosExperiments();
  const trigger = useTriggerChaos();
  const { toast } = useToast();

  const handleTrigger = (type: string, title: string) => {
    trigger.mutate({
      type,
      title,
      targetService: "frontend", // Default target for demo
    }, {
      onSuccess: () => {
        toast({
          title: "Chaos Injected! 🔥",
          description: `Experiment '${title}' started successfully. Watch the dashboard for impact.`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold flex items-center gap-3">
          <Zap className="h-8 w-8 text-amber-400 fill-amber-400" />
          Chaos Engineering Lab
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Inject controlled failures into the cluster to validate reliability and self-healing mechanisms. 
          Use responsibly - this will cause real outages in the demo environment.
        </p>
      </div>

      {/* Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {EXPERIMENTS.map((exp) => (
          <div key={exp.type} className={`glass-panel p-6 rounded-2xl border ${exp.border} relative overflow-hidden`}>
            <div className={`w-12 h-12 rounded-xl ${exp.bg} flex items-center justify-center mb-4`}>
              <exp.icon className={`h-6 w-6 ${exp.color}`} />
            </div>
            <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 h-12">
              {exp.description}
            </p>
            <button
              onClick={() => handleTrigger(exp.type, exp.title)}
              disabled={trigger.isPending}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                bg-white/5 hover:bg-white/10 text-white border border-white/10`}
            >
              {trigger.isPending ? (
                "Injecting..."
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Inject Failure
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-bold">Experiment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Experiment</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history?.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{exp.title}</td>
                  <td className="px-6 py-4 font-mono text-xs">{exp.targetService}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${exp.status === 'running' ? 'bg-amber-500/20 text-amber-400' : 'bg-secondary text-muted-foreground'}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{exp.duration}s</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {exp.startedAt && new Date(exp.startedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {(!history || history.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No experiments run yet. Be brave, break something.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
