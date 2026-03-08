import { useState } from "react";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import { X } from "lucide-react";

const TRANSLATE_LANGS = [
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "ko", label: "한국어" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "sv", label: "Svenska" },
];

function ToolPanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="col-span-full bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300" data-testid={`panel-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="button-close-panel">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function WatermarkTool({ onClose }: { onClose: () => void }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const [wmText, setWmText] = useState("ProToolHub");
  const [wmFontSize, setWmFontSize] = useState("0");
  const [wmAngle, setWmAngle] = useState("45");
  const [wmOpacity, setWmOpacity] = useState("0.3");
  const [wmColor, setWmColor] = useState("#BFBFBF");

  const hexToRgbNorm = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r: r.toFixed(3), g: g.toFixed(3), b: b.toFixed(3) };
  };

  const c = hexToRgbNorm(wmColor);
  const extraParams = {
    watermark: wmText,
    fontSize: wmFontSize,
    angle: wmAngle,
    opacity: wmOpacity,
    colorR: c.r,
    colorG: c.g,
    colorB: c.b,
  };

  return (
    <ToolPanel title={isEn ? "Add Watermark" : "Filigran Ekle"} onClose={onClose}>
      <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4" data-testid="watermark-options-inline">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {isEn ? "Watermark Text" : "Filigran Metni"}
          </label>
          <input
            data-testid="input-watermark-text-inline"
            type="text"
            value={wmText}
            onChange={e => setWmText(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            placeholder="ProToolHub"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isEn ? "Font Size (0=auto)" : "Yazı Boyutu (0=oto)"}
            </label>
            <input data-testid="input-wm-fontsize-inline" type="number" min="0" max="200" value={wmFontSize} onChange={e => setWmFontSize(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isEn ? "Angle (°)" : "Açı (°)"}
            </label>
            <input data-testid="input-wm-angle-inline" type="number" min="-180" max="180" value={wmAngle} onChange={e => setWmAngle(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isEn ? "Opacity" : "Saydamlık"}
            </label>
            <input data-testid="input-wm-opacity-inline" type="number" min="0.01" max="1" step="0.05" value={wmOpacity} onChange={e => setWmOpacity(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isEn ? "Color" : "Renk"}
            </label>
            <input data-testid="input-wm-color-inline" type="color" value={wmColor} onChange={e => setWmColor(e.target.value)} className="w-full h-9 border border-slate-300 rounded-lg cursor-pointer" />
          </div>
        </div>
      </div>
      <ToolWorkflow toolName="Add Watermark" acceptedFileTypes=".pdf" extraParams={extraParams} />
    </ToolPanel>
  );
}

export function SignPdfTool({ onClose }: { onClose: () => void }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <ToolPanel title={isEn ? "Sign PDF" : "PDF İmzala"} onClose={onClose}>
      <ToolWorkflow toolName="Sign PDF" acceptedFileTypes=".pdf" />
    </ToolPanel>
  );
}

export function TranslatePdfTool({ onClose }: { onClose: () => void }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [targetLang, setTargetLang] = useState("en");

  return (
    <ToolPanel title={isEn ? "Translate PDF" : "PDF Çevir"} onClose={onClose}>
      <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200" data-testid="translate-options-inline">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {isEn ? "Target Language" : "Hedef Dil"}
        </label>
        <select
          data-testid="select-target-lang-inline"
          value={targetLang}
          onChange={e => setTargetLang(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {TRANSLATE_LANGS.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
      <ToolWorkflow toolName="Translate PDF" acceptedFileTypes=".pdf" extraParams={{ targetLang }} />
    </ToolPanel>
  );
}
