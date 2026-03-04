export function Stats() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-16 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border bg-card border rounded-2xl shadow-sm overflow-hidden py-6">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl font-heading font-extrabold text-primary mb-1">1m</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active<br/>Users</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl font-heading font-extrabold text-primary mb-1">10m</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files<br/>Converted</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl font-heading font-extrabold text-primary mb-1">200+</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Online<br/>Tools</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl font-heading font-extrabold text-primary mb-1">500k</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">PDFs<br/>Created</div>
        </div>
      </div>
    </div>
  );
}