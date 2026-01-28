import { Link, useLocation } from "wouter";
import { 
  LayoutGrid, 
  Activity, 
  Server, 
  Terminal, 
  Zap, 
  AlertTriangle, 
  ShoppingCart,
  Box
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { icon: LayoutGrid, label: "Overview", href: "/" },
  { icon: Box, label: "Cluster Map", href: "/cluster" },
  { icon: Activity, label: "Metrics", href: "/metrics" },
  { icon: Terminal, label: "Logs", href: "/logs" },
  { icon: Zap, label: "Chaos Lab", href: "/chaos" },
  { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-sidebar-foreground leading-none">KubeWatch</h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">v2.4.0-prod</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Platform</div>
        {menuItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className={clsx("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-gradient-to-br from-accent/20 to-purple-900/20 border border-accent/20 p-4">
          <h3 className="font-bold text-accent mb-1">Live Target App</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Simulate real traffic by visiting the store.
          </p>
          <Link href="/store">
            <button className="w-full py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Open Store
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
