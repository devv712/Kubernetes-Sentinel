import { useLogs } from "@/hooks/use-observability";
import { useState, useRef, useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";
import clsx from "clsx";

export default function Logs() {
  const [service, setService] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const { data: logs } = useLogs(service, level);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold">Log Explorer</h2>
          <p className="text-muted-foreground">Centralized log aggregation via Loki.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:bg-accent/10 flex items-center gap-2">
             <Download className="h-4 w-4" /> Export
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 p-4 glass-panel rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search logs..." 
            className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select 
          className="bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">All Services</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="database">database</option>
        </select>
        <select 
          className="bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="info">INFO</option>
          <option value="warn">WARN</option>
          <option value="error">ERROR</option>
        </select>
      </div>

      {/* Terminal View */}
      <div className="flex-1 glass-panel rounded-lg border border-white/10 bg-black/50 font-mono text-sm overflow-hidden flex flex-col relative shadow-inner">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-muted-foreground">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="ml-2">Live Tail</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin" ref={scrollRef}>
          {logs?.map((log) => (
            <div key={log.id} className="flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group">
              <span className="text-muted-foreground w-32 shrink-0 select-none opacity-50">
                {new Date(log.timestamp!).toLocaleTimeString()}
              </span>
              <span className={clsx(
                "w-16 shrink-0 font-bold",
                log.level === 'error' && "text-rose-500",
                log.level === 'warn' && "text-amber-500",
                log.level === 'info' && "text-emerald-500",
              )}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-purple-400 w-24 shrink-0">[{log.service}]</span>
              <span className="text-gray-300 group-hover:text-white transition-colors">{log.message}</span>
            </div>
          ))}
          {!logs?.length && (
             <div className="text-center text-muted-foreground py-20">No logs found matching criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
