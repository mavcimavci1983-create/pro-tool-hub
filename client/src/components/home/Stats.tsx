export function Stats() {
  const items = [
    { value: "47", label: <>Free<br />Tools</> },
    { value: "0", label: <>Sign-ups<br />Required</> },
    { value: "100%", label: <>Free to<br />Use</> },
    { value: "In-browser", label: <>Image &amp; Video<br />Processing</> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-16 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border bg-card border rounded-2xl shadow-sm overflow-hidden py-6">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center px-4">
            <div className="text-4xl font-heading font-extrabold text-primary mb-1">{item.value}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
