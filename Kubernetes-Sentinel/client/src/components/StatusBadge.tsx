import clsx from "clsx";

type Status = "Running" | "Pending" | "CrashLoopBackOff" | "Terminating" | "Ready" | "NotReady" | "Unknown" | "firing" | "resolved" | "critical" | "warning";

export function StatusBadge({ status, className }: { status: Status | string; className?: string }) {
  const styles = {
    // Pod/Node States
    Running: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Ready: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Unknown: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    Terminating: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    CrashLoopBackOff: "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse",
    NotReady: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    
    // Alert States
    firing: "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse",
    critical: "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  const activeStyle = styles[status as keyof typeof styles] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <span className={clsx(
      "px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border inline-flex items-center gap-1.5",
      activeStyle,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
