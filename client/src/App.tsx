import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ImageToWebp from "@/pages/ImageToWebp";
import MergePdf from "@/pages/MergePdf";
import RemoveBackground from "@/pages/RemoveBackground";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools/image-to-webp" component={ImageToWebp} />
      <Route path="/tools/merge-pdf" component={MergePdf} />
      <Route path="/tools/remove-background" component={RemoveBackground} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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