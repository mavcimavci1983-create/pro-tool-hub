import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full mt-20">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-heading font-bold mb-4">Get more with Premium</h2>
            <p className="text-primary-foreground/80 mb-6">
              Take your projects further with premium tools that stay out of your way and work smarter. Create without limits, ads, or roadblocks. Get started for just $5.99 a month.
            </p>
            <div className="flex gap-4 mb-6 text-sm font-medium">
              <span className="flex items-center gap-1">✓ Ad-free</span>
              <span className="flex items-center gap-1">✓ Unlimited usage</span>
              <span className="flex items-center gap-1">✓ Faster processing</span>
            </div>
            <Button variant="secondary" className="rounded-full font-bold px-8">
              Get started
            </Button>
          </div>
          <div className="hidden lg:block w-80 h-48 bg-primary-foreground/10 rounded-2xl border border-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground/50 font-bold">Premium Illustration</span>
          </div>
        </div>
      </div>
      
      <div className="bg-background py-8 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-heading font-bold text-xl tracking-tight">
            Micro<span className="text-primary">Wow</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Navigate</a>
              <a href="#" className="hover:text-primary transition-colors">Tools</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Powered by <a href="https://xoxo.gossip.ai" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">XOXO Gossip AI</a>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 MicroWow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}