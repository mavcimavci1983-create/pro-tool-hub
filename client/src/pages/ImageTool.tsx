import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
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
  WatermarkRemoverTool,
} from "@/components/home/ImageTools";
import { ToolSeoContent, hasToolSeo } from "@/components/tool/ToolSeoContent";
import { ToolGuides } from "@/components/tool/ToolGuides";

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
  if (t.includes("watermark") || t.includes("remove watermark")) return <WatermarkRemoverTool />;
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
          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight leading-none" data-testid="text-tool-title">
                  {title}
                </h1>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>

              {getInlineTool(title)}

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <ToolSeoContent title={title} />

                      {!hasToolSeo(title) && (
                <div className="grid md:grid-cols-2 gap-12 text-left mb-10">
                        <section>
                          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">How to Use {title}</h2>
                          <p className="text-md font-medium leading-relaxed mb-3">Using our <strong>{title}</strong> tool is effortless. Simply drag and drop your image into the upload area or click to select a file from your device. The tool processes your image instantly — no account, no installation, no waiting.</p>
                          <p className="text-md font-medium leading-relaxed">Results are available for download immediately after processing. Most image operations complete in under 5 seconds. Use this tool as many times as you need with no daily limits and no watermarks on output files.</p>
                        </section>
                        <section>
                          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Why Choose ProToolHub for Images?</h2>
                          <p className="text-md font-medium leading-relaxed mb-3">Our image tools use browser-side processing via the Canvas API, so your images stay on your device. No upload means results appear as fast as your machine can produce them, and your photos and designs never travel to us.</p>
                          <p className="text-md font-medium leading-relaxed">From compressing photos for email to converting formats for web use, ProToolHub handles it all with professional quality and zero cost. No watermarks are ever added to your output files.</p>
                        </section>
                      </div>
                )}
                      <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                          <div className="text-2xl mb-2">🖥️</div>
                          <h3 className="font-bold text-slate-900 mb-2">Processed In Your Browser</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">Every image tool on ProToolHub runs in your browser using the Canvas API. Your images are not uploaded anywhere — there is no server request carrying your file, so nothing of it reaches us. What happens in your browser stays in your browser.</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                          <div className="text-2xl mb-2">🎨</div>
                          <h3 className="font-bold text-slate-900 mb-2">Professional Quality Output</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">We never add watermarks to your output. Every processed image maintains the highest possible quality. Our compression algorithms are tuned to reduce file size while preserving visual clarity — perfect for web, social media, or print use.</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                          <div className="text-2xl mb-2">📱</div>
                          <h3 className="font-bold text-slate-900 mb-2">Works on All Devices</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">ProToolHub image tools are fully responsive and work seamlessly on desktop, tablet, and mobile. No app download required — just open your browser and start processing images instantly from any device, anywhere in the world.</p>
                        </div>
                      </div>
                      <div className="bg-slate-900 rounded-2xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-3">Your Privacy Is Our Priority</h3>
                        <p className="text-slate-300 leading-relaxed text-sm">The image tools on ProToolHub run entirely in your browser using the Canvas API — your photos are never uploaded to a server at all. We do not analyse your images, build a profile from them, or share them with anyone.</p>
                      </div>
                      <ToolGuides />
                    </article>
                  </div>

                      </div>
              </main>
              <Footer />
            </div>
          </HelmetProvider>
        );
      }
