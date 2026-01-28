import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";

// Pages
import Dashboard from "@/pages/Dashboard";
import ClusterMap from "@/pages/ClusterMap";
import Metrics from "@/pages/Metrics";
import Logs from "@/pages/Logs";
import ChaosLab from "@/pages/ChaosLab";
import Alerts from "@/pages/Alerts";
import Store from "@/pages/Store";
import NotFound from "@/pages/not-found";

function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen scrollbar-thin">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  // The store has its own layout, entirely separate from the platform dashboard
  if (location.startsWith("/store")) {
    return (
      <Switch>
        <Route path="/store" component={Store} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // SRE Platform Routes
  return (
    <PlatformLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cluster" component={ClusterMap} />
        <Route path="/metrics" component={Metrics} />
        <Route path="/logs" component={Logs} />
        <Route path="/chaos" component={ChaosLab} />
        <Route path="/alerts" component={Alerts} />
        <Route component={NotFound} />
      </Switch>
    </PlatformLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
