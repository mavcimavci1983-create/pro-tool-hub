import React from "react";

type AdSize = "leaderboard" | "skyscraper-left" | "skyscraper-right" | "billboard" | "mobile-anchor";

const AD_CONFIG: Record<AdSize, { w: number; h: number; label: string }> = {
  "leaderboard":      { w: 728, h: 90,  label: "Leaderboard Ad (728x90)" },
  "skyscraper-left":  { w: 160, h: 600, label: "Left Tower Ad (160x600)" },
  "skyscraper-right": { w: 160, h: 600, label: "Right Tower Ad (160x600)" },
  "billboard":        { w: 970, h: 250, label: "Billboard Ad (970x250)" },
  "mobile-anchor":    { w: 320, h: 50,  label: "Mobile Ad (320x50)" },
};

export function AdUnit({ size, className = "" }: { size: AdSize; className?: string }) {
  const cfg = AD_CONFIG[size];
  return (
    <div
      className={`ad-unit-container flex items-center justify-center ${className}`}
      data-testid={`ad-${size}`}
      data-ad-size={`${cfg.w}x${cfg.h}`}
    >
      <div
        className="bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-bold select-none"
        style={{ width: `${cfg.w}px`, maxWidth: "100%", height: `${cfg.h}px` }}
      >
        {cfg.label}
      </div>
    </div>
  );
}

export function LeaderboardAd() {
  return (
    <div className="w-full bg-slate-50/80 border-b border-slate-100 flex items-center justify-center py-3 overflow-hidden">
      <AdUnit size="leaderboard" />
    </div>
  );
}

export function StickySkyscraper({ side }: { side: "left" | "right" }) {
  return (
    <aside className={`hidden lg:block w-[160px] flex-shrink-0`}>
      <div className="sticky top-24">
        <AdUnit size={side === "left" ? "skyscraper-left" : "skyscraper-right"} />
      </div>
    </aside>
  );
}

export function BillboardAd() {
  return (
    <div className="w-full flex items-center justify-center py-8 overflow-hidden">
      <AdUnit size="billboard" />
    </div>
  );
}

export function MobileAnchorAd() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-center py-1.5">
      <AdUnit size="mobile-anchor" />
    </div>
  );
}
