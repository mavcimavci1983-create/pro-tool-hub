import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "PDF Tools",
    subtitle: "Solve Your PDF Problems",
    count: "45+ tools",
    featured: "Merge PDF",
    featuredLink: "/tool/merge-pdf",
    color: "bg-purple-500",
    bgLight: "bg-purple-50",
    textColor: "text-purple-500",
    hoverShadow: "hover:shadow-purple-500/20"
  },
  {
    title: "Image Tools",
    subtitle: "Solve Your Image Problems",
    count: "30+ tools",
    featured: "Remove Background",
    featuredLink: "/tool/remove-background",
    color: "bg-orange-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-500",
    hoverShadow: "hover:shadow-orange-500/20"
  },
  {
    title: "Video Tools",
    subtitle: "Solve Your Video Problems",
    count: "10+ tools",
    featured: "Mute Video",
    color: "bg-rose-500",
    bgLight: "bg-rose-50",
    textColor: "text-rose-500",
    hoverShadow: "hover:shadow-rose-500/20"
  },
  {
    title: "AI Write",
    subtitle: "Solve Your Text Problems",
    count: "10+ tools",
    featured: "Paragraph Writer",
    color: "bg-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    hoverShadow: "hover:shadow-blue-600/20"
  },
  {
    title: "File Tools",
    subtitle: "Solve Your File Problems",
    count: "15+ tools",
    featured: "Split Excel",
    color: "bg-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
    hoverShadow: "hover:shadow-teal-600/20"
  }
];

export function CategoryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12 w-full max-w-7xl mx-auto px-4">
      {categories.map((cat, i) => (
        <div key={i} className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-sm ${cat.hoverShadow} bg-card border group`}>
          <div className={`${cat.color} p-5 text-white flex flex-col h-32 relative overflow-hidden`}>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <div className="w-4 h-4 bg-white rounded-sm opacity-80" />
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {cat.count}
              </span>
            </div>
            
            <div className="mt-auto z-10">
              <h3 className="font-bold text-lg leading-tight">{cat.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{cat.subtitle} <ArrowRight className="inline w-3 h-3 ml-1" /></p>
            </div>
          </div>
          
          <div className="p-3 bg-card flex justify-between items-center text-xs border-t">
            <span className="text-muted-foreground font-medium">Featured Tool:</span>
            {cat.featuredLink ? (
              <Link href={cat.featuredLink}>
                <span className={`font-bold cursor-pointer hover:underline ${cat.textColor}`}>
                  {cat.featured}
                </span>
              </Link>
            ) : (
              <span className={`font-bold cursor-pointer hover:underline ${cat.textColor}`}>
                {cat.featured}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}