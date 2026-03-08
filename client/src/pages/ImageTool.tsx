import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { LeaderboardAd, StickySkyscraper, BillboardAd } from "@/components/ads/AdUnit";
import {
  CompressImageTool,
  ResizeImageTool,
  CropImageTool,
  ConvertFormatTool,
  WebPToJpgTool,
  WebPToPngTool,
  ImageToWebpTool,
  HeicToJpgTool,
  RemoveBackgroundTool,
  AddTextToImageTool,
} from "@/components/home/ImageTools";

const translations = translationsData as Record<string, any>;

function getInlineTool(title: string) {
  const t = title.toLowerCase();
  if (t.includes("compress"))          return <CompressImageTool />;
  if (t.includes("resize"))            return <ResizeImageTool />;
  if (t.includes("crop"))              return <CropImageTool />;
  if (t.includes("webp to jpg"))       return <WebPToJpgTool />;
  if (t.includes("webp to png"))       return <WebPToPngTool />;
  if (t.includes("to webp") || t.includes("image to webp")) return <ImageToWebpTool />;
  if (t.includes("heic"))              return <HeicToJpgTool />;
  if (t.includes("remove") || t.includes("background")) return <RemoveBackgroundTool />;
  if (t.includes("add text") || t.includes("text"))      return <AddTextToImageTool />;
  if (t.includes("convert"))           return <ConvertFormatTool />;
  return <CompressImageTool />;
}

export default function ImageTool({ title = "Image Tool", desc = "Professional image processing tool." }) {
  const { language } = useLanguageStore();

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Image Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20">
          <LeaderboardAd />

          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <StickySkyscraper side="left" />

            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight leading-none" data-testid="text-tool-title">
                  {title}
                </h1>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>

              {getInlineTool(title)}

              <BillboardAd />

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Image Processing</h2>
                    <p className="text-md font-medium leading-relaxed">High-performance image suite with 100% privacy and zero watermarks. All files are processed entirely in your browser — nothing is uploaded.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">100% Client-Side</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"Your images never leave your device. All processing happens locally in your browser using Canvas API — zero server uploads."</p>
                  </section>
                </div>
              </article>
            </div>

            <StickySkyscraper side="right" />
          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
