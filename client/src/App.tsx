import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ImageToWebp from "@/pages/ImageToWebp";
import GenericPdfTool from "@/pages/GenericPdfTool";
import VideoTool from "@/pages/VideoTool";
import { Scissors, VolumeX, Minimize } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* PDF Silo Tools */}
      <Route path="/tools/edit-pdf">
        <GenericPdfTool title="Edit PDF" desc="The best free PDF editor online. Add text, images, and shapes easily." />
      </Route>
      <Route path="/tools/pdf-to-word">
        <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Microsoft Word files with high accuracy." />
      </Route>
      <Route path="/tools/jpg-to-pdf">
        <GenericPdfTool title="JPG to PDF" desc="Convert multiple images to a single PDF document in seconds." />
      </Route>
      <Route path="/tools/merge-pdf">
        <GenericPdfTool title="Merge PDF" desc="Combine two or more PDF files into a single document securely." />
      </Route>
      <Route path="/tools/compress-pdf">
        <GenericPdfTool title="Compress PDF" desc="Reduce the file size of your PDF while maintaining quality." />
      </Route>
      <Route path="/tools/word-to-pdf">
        <GenericPdfTool title="Word to PDF" desc="Turn Word documents into high-quality PDF files instantly." />
      </Route>
      <Route path="/tools/split-pdf">
        <GenericPdfTool title="Split PDF" desc="Separate one page or a whole set for easy conversion into independent PDF files." />
      </Route>
      <Route path="/tools/remove-password">
        <GenericPdfTool title="Remove PDF Password" desc="Unlock secure PDF documents and remove passwords forever." />
      </Route>
      <Route path="/tools/pdf-translator">
        <GenericPdfTool title="PDF Translator" desc="Translate your PDF documents into over 100 languages for free." />
      </Route>
      <Route path="/tools/esign">
        <GenericPdfTool title="eSign PDF" desc="Sign documents online with a legally binding digital signature." />
      </Route>
      <Route path="/tools/protect-pdf">
        <GenericPdfTool title="Protect PDF" desc="Add a password and encrypt your PDF files to keep them secure." />
      </Route>
      <Route path="/tools/rearrange-pdf">
        <GenericPdfTool title="Rearrange PDF" desc="Change the order of pages in your PDF document effortlessly." />
      </Route>
      <Route path="/tools/extract-text">
        <GenericPdfTool title="Extract Text from PDF" desc="Get all the text from your PDF using advanced OCR technology." />
      </Route>

      {/* Video Silo Tools */}
      <Route path="/tools/video-to-gif">
        <VideoTool title="Video to GIF" desc="Free online video to gif converter - No Watermark" icon={Scissors} />
      </Route>
      <Route path="/tools/mute-video">
        <VideoTool title="Mute Video" desc="Remove audio from video online for free - Fast & Secure" icon={VolumeX} />
      </Route>
      <Route path="/tools/video-resizer">
        <VideoTool title="Video Resizer" desc="Resize video online for social media - No Watermark" icon={Minimize} />
      </Route>

      {/* Image Tools */}
      <Route path="/tools/image-to-webp" component={ImageToWebp} />
      <Route path="/tools/remove-background">
        <GenericPdfTool title="Remove Background" desc="AI-powered background removal tool." />
      </Route>
      
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