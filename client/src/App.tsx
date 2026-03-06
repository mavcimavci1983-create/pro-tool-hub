import { Header } from "@/components/layout/Header";
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
import { Scissors, VolumeX, Minimize, Music, Play, Download, ImageIcon, Video, Youtube, FileText, Type, Presentation, RefreshCw } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      <Route path="/tools/rotate-pdf">
        <GenericPdfTool title="Rotate PDF" desc="Rotate your PDF pages to the correct orientation easily." />
      </Route>
      <Route path="/tools/add-watermark">
        <GenericPdfTool title="Add Watermark" desc="Add text or image watermarks to your PDF documents." />
      </Route>
      <Route path="/tools/pdf-to-text">
        <GenericPdfTool title="PDF to Text (OCR)" desc="Convert scanned PDFs into editable text documents using OCR." />
      </Route>
      <Route path="/tools/pdf-to-word">
        <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Microsoft Word files with high accuracy." />
      </Route>
      <Route path="/tools/pdf-to-jpg">
        <GenericPdfTool title="PDF to JPG" desc="Extract pages from PDF as high-quality JPG images." />
      </Route>
      <Route path="/tools/pdf-to-excel">
        <GenericPdfTool title="PDF to Excel" desc="Extract tables from PDF into editable Excel sheets." />
      </Route>
      <Route path="/tools/pdf-to-powerpoint">
        <GenericPdfTool title="PDF to PowerPoint" desc="Convert PDF presentations into editable PPTX slides." />
      </Route>
      <Route path="/tools/word-to-pdf">
        <GenericPdfTool title="Word to PDF" desc="Turn Word documents into high-quality PDF files instantly." />
      </Route>
      <Route path="/tools/jpg-to-pdf">
        <GenericPdfTool title="JPG to PDF" desc="Convert multiple images to a single PDF document in seconds." />
      </Route>
      <Route path="/tools/merge-pdf">
        <GenericPdfTool title="Merge PDF" desc="Combine two or more PDF files into a single document securely." />
      </Route>
      <Route path="/tools/split-pdf">
        <GenericPdfTool title="Split PDF" desc="Separate one page or a whole set for easy conversion into independent PDF files." />
      </Route>
      <Route path="/tools/compress-pdf">
        <GenericPdfTool title="Compress PDF" desc="Reduce the file size of your PDF while maintaining quality." />
      </Route>
      <Route path="/tools/edit-pdf">
        <GenericPdfTool title="Edit PDF" desc="The best free PDF editor online. Add text, images, and shapes easily." />
      </Route>
      <Route path="/tools/remove-password">
        <GenericPdfTool title="Unlock PDF" desc="Unlock secure PDF documents and remove passwords forever." />
      </Route>
      <Route path="/tools/protect-pdf">
        <GenericPdfTool title="Protect PDF" desc="Add a password and encrypt your PDF files to keep them secure." />
      </Route>

      <Route path="/tools/video-to-gif">
        <VideoTool title="Video to GIF" desc="Convert your MP4 or MOV videos to high-quality animated GIFs instantly." icon={Scissors} />
      </Route>
      <Route path="/tools/video-to-mp3">
        <VideoTool title="Video to MP3" desc="Extract high-quality audio from any video file in seconds." icon={Music} />
      </Route>
      <Route path="/tools/mp4-to-webm">
        <VideoTool title="MP4 to WebM" desc="Convert MP4 videos to WebM format for better web performance." icon={Play} />
      </Route>
      <Route path="/tools/mute-video">
        <VideoTool title="Mute Video" desc="Remove audio from your video files while keeping the visual quality." icon={VolumeX} />
      </Route>
      <Route path="/tools/video-resizer">
        <VideoTool title="Video Resizer" desc="Resize your videos for social media platforms without watermarks." icon={Minimize} />
      </Route>
      <Route path="/tools/rotate-video">
        <VideoTool title="Rotate Video" desc="Fix sideways or upside-down videos by rotating them 90, 180, or 270 degrees." icon={RefreshCw} />
      </Route>
      <Route path="/tools/trim-video">
        <VideoTool title="Trim Video" desc="Cut and trim specific parts of your video with frame-perfect accuracy." icon={Scissors} />
      </Route>
      <Route path="/tools/facebook-download">
        <VideoTool title="Facebook Download" desc="Save public Facebook videos to your device for offline viewing." icon={Download} />
      </Route>
      <Route path="/tools/instagram-download">
        <VideoTool title="Instagram Download" desc="Save Instagram reels and videos quickly and easily." icon={Download} />
      </Route>
      <Route path="/tools/twitter-download">
        <VideoTool title="Twitter Download" desc="Download videos from Twitter (X) posts instantly." icon={Download} />
      </Route>

      {/* Write Silo Tools */}
      <Route path="/tools/paragraph-writer">
        <GenericPdfTool title="Paragraph Writer" desc="Generate high-quality paragraphs on any topic using AI." />
      </Route>
      <Route path="/tools/sentence-rewriter">
        <GenericPdfTool title="Sentence Rewriter" desc="Rewrite sentences to improve clarity, tone, and style." />
      </Route>
      <Route path="/tools/essay-writer">
        <GenericPdfTool title="Essay Writer" desc="Create structured essays from a single prompt using AI." />
      </Route>
      <Route path="/tools/article-writer">
        <GenericPdfTool title="Article Writer" desc="Generate complete articles and blog posts from a title." />
      </Route>
      <Route path="/tools/fb-headline-generator">
        <GenericPdfTool title="Facebook Headline Generator" desc="Create catchy headlines for your Facebook ads and posts." />
      </Route>
      <Route path="/tools/faq-generator">
        <GenericPdfTool title="FAQ Generator" desc="Generate frequently asked questions for your website or product." />
      </Route>
      <Route path="/tools/real-estate-descriptions">
        <GenericPdfTool title="Real Estate Descriptions" desc="Create compelling descriptions for your property listings." />
      </Route>
      <Route path="/tools/paragraph-completer">
        <GenericPdfTool title="Paragraph Completer" desc="Finish your thoughts and complete paragraphs automatically." />
      </Route>
      <Route path="/tools/business-name-generator">
        <GenericPdfTool title="Business Name Generator" desc="Find the perfect name for your new business or startup." />
      </Route>
      <Route path="/tools/blog-outline-generator">
        <GenericPdfTool title="Blog Outline Generator" desc="Generate structured outlines for your next blog post." />
      </Route>
      <Route path="/tools/blog-post-ideas">
        <GenericPdfTool title="Blog Post Ideas" desc="Get endless inspiration for your next content piece." />
      </Route>
      <Route path="/tools/instagram-caption-generator">
        <GenericPdfTool title="Instagram Caption Generator" desc="Create engaging captions for your Instagram photos." />
      </Route>
      <Route path="/tools/linkedin-post-generator">
        <GenericPdfTool title="LinkedIn Post Generator" desc="Generate professional posts for your LinkedIn network." />
      </Route>
      <Route path="/tools/grammar-fixer">
        <GenericPdfTool title="Grammar Fixer" desc="Instantly fix grammar and spelling errors in your text." />
      </Route>
      <Route path="/tools/content-improver">
        <GenericPdfTool title="Content Improver" desc="Enhance the quality and readability of your existing content." />
      </Route>

      {/* Video Silo Tools Extended */}
      <Route path="/tools/compress-video">
        <VideoTool title="Compress Video" desc="Lessen the file size of a Video file while maintaining quality." icon={Minimize} />
      </Route>
      <Route path="/tools/trim-video">
        <VideoTool title="Trim Video" desc="Select a start and stop of a video and download the trimmed version." icon={Scissors} />
      </Route>
      <Route path="/tools/mp4-to-mp3">
        <VideoTool title="MP4 to MP3" desc="Convert MP4 video files to high-quality MP3 audio." icon={Music} />
      </Route>
      <Route path="/tools/audio-to-text">
        <GenericPdfTool title="Audio to Text" desc="Transcribe audio files into editable text automatically." />
      </Route>
      <Route path="/tools/extract-audio">
        <VideoTool title="Extract Audio" desc="Separate and download the audio track from any video file." icon={Music} />
      </Route>
      <Route path="/tools/mov-to-mp4">
        <VideoTool title="MOV to MP4" desc="Convert Apple MOV video files to standard MP4 format." icon={Play} />
      </Route>
      <Route path="/tools/mkv-to-mp4">
        <VideoTool title="MKV to MP4" desc="Convert MKV video files to widely supported MP4 format." icon={Play} />
      </Route>
      <Route path="/tools/facebook-download">
        <VideoTool title="Facebook Video Downloader" desc="Download public videos from Facebook via URL." icon={Download} />
      </Route>
      <Route path="/tools/tiktok-downloader">
        <VideoTool title="TikTok Video Downloader" desc="Download TikTok videos without watermark for free." icon={Download} />
      </Route>
      <Route path="/tools/instagram-download">
        <VideoTool title="Instagram Video Downloader" desc="Save Instagram reels and videos to your device." icon={Download} />
      </Route>
      <Route path="/tools/twitter-download">
        <VideoTool title="Twitter Video Downloader" desc="Download videos from Twitter/X posts instantly." icon={Download} />
      </Route>
      <Route path="/tools/m4a-to-mp3">
        <VideoTool title="M4A to MP3" desc="Convert M4A audio files to standard MP3 format." icon={Music} />
      </Route>
      <Route path="/tools/video-to-webp">
        <VideoTool title="Video to WebP" desc="Convert video clips to lightweight animated WebP images." icon={ImageIcon} />
      </Route>

      {/* File Silo Tools */}
      <Route path="/tools/split-csv">
        <GenericPdfTool title="Split CSV" desc="Separate a large CSV file into multiple smaller documents." />
      </Route>
      <Route path="/tools/excel-to-pdf">
        <GenericPdfTool title="Excel to PDF" desc="Convert Excel spreadsheets to professional PDF documents." />
      </Route>
      <Route path="/tools/excel-to-xml">
        <GenericPdfTool title="Excel to XML" desc="Convert Excel data into XML format for technical use." />
      </Route>
      <Route path="/tools/xml-to-csv">
        <GenericPdfTool title="XML to CSV" desc="Transform XML data into easy-to-read CSV format." />
      </Route>
      <Route path="/tools/split-excel">
        <GenericPdfTool title="Split Excel" desc="Divide large Excel files into multiple workbooks." />
      </Route>
      <Route path="/tools/xml-to-excel">
        <GenericPdfTool title="XML to Excel" desc="Convert XML files into editable Excel spreadsheets." />
      </Route>
      <Route path="/tools/csv-to-excel">
        <GenericPdfTool title="CSV to Excel" desc="Import CSV data into structured Excel worksheets." />
      </Route>
      <Route path="/tools/xml-to-json">
        <GenericPdfTool title="XML to JSON" desc="Convert XML data into JSON format for developers." />
      </Route>

      <Route path="/tools/image-to-webp" component={ImageToWebp} />
      <Route path="/tools/remove-background">
        <GenericPdfTool title="Remove Background" desc="AI-powered background removal tool. Processed locally in your browser for 100% privacy." />
      </Route>
      <Route path="/tools/jpg-to-pdf">
        <GenericPdfTool title="JPG to PDF" desc="Convert JPG images to PDF documents instantly." />
      </Route>
      <Route path="/tools/pdf-to-jpg">
        <GenericPdfTool title="PDF to JPG" desc="Extract pages from PDF as high-quality JPG images." />
      </Route>
      <Route path="/tools/webp-to-jpg">
        <GenericPdfTool title="WebP to JPG" desc="Convert WebP images to high-quality JPG format." />
      </Route>
      <Route path="/tools/png-to-jpg">
        <GenericPdfTool title="PNG to JPG" desc="Convert PNG images to JPG with adjustable quality." />
      </Route>
      <Route path="/tools/resize-image">
        <GenericPdfTool title="Resize Image" desc="Change image dimensions while maintaining quality." />
      </Route>
      <Route path="/tools/compress-image">
        <GenericPdfTool title="Compress Image" desc="Reduce image file size with minimal quality loss." />
      </Route>
      <Route path="/tools/crop-image">
        <GenericPdfTool title="Crop Image" desc="Crop images to specific aspect ratios or selections." />
      </Route>
      <Route path="/tools/add-text-to-image">
        <GenericPdfTool title="Add Text to Image" desc="Overlay text on your images with custom fonts." />
      </Route>
      <Route path="/tools/blur-background">
        <GenericPdfTool title="Blur Background" desc="Apply professional bokeh blur to image backgrounds." />
      </Route>
      <Route path="/tools/profile-picture-maker">
        <GenericPdfTool title="Profile Picture Maker" desc="Create professional social media profile pictures." />
      </Route>
      <Route path="/tools/ai-image-generator">
        <GenericPdfTool title="AI Image Generator" desc="Create beautiful images from text descriptions using advanced AI." />
      </Route>
      <Route path="/tools/black-and-white">
        <GenericPdfTool title="Black and White" desc="Convert color images to artistic black and white." />
      </Route>
      <Route path="/tools/upscale-image">
        <GenericPdfTool title="Upscale Image" desc="Increase the resolution and quality of your image using AI." />
      </Route>

      <Route path="/tools/all-pdf">
        <GenericPdfTool title="All PDF Tools" desc="Browse our complete collection of 45+ PDF processing tools." />
      </Route>
      <Route path="/tools/all-image">
        <GenericPdfTool title="All Image Tools" desc="Explore 30+ AI-powered image editing and optimization tools." />
      </Route>
      <Route path="/tools/webp-to-jpg">
        <GenericPdfTool title="WebP to JPG" desc="Convert WebP images to high-quality JPG format." />
      </Route>
      <Route path="/tools/all-video">
        <VideoTool title="All Video Tools" desc="Access all our video compression, trimming, and downloading tools." icon={Video} />
      </Route>
      <Route path="/tools/all-write">
        <GenericPdfTool title="All AI Writing Tools" desc="Full suite of AI-powered content generation and editing tools." />
      </Route>
      <Route path="/tools/all-file">
        <GenericPdfTool title="All File Tools" desc="Complete set of CSV, Excel, XML, and JSON conversion utilities." />
      </Route>
      
      {/* Video Tools Ext */}
      <Route path="/tools/youtube-to-text">
        <VideoTool title="YouTube to Text" desc="Convert YouTube video to text automatically." icon={Youtube} />
      </Route>
      <Route path="/tools/youtube-transcript">
        <VideoTool title="YouTube Transcript" desc="Extract transcript from any YouTube video." icon={FileText} />
      </Route>
      <Route path="/tools/youtube-script-writer">
        <GenericPdfTool title="YouTube Script Writer" desc="Generate professional scripts for your YouTube videos." />
      </Route>
      <Route path="/tools/video-to-text">
        <VideoTool title="Video to Text" desc="Convert video speech into editable text." icon={Type} />
      </Route>

      {/* Converter Silo Tools */}
      <Route path="/tools/word-to-pdf">
        <GenericPdfTool title="Word to PDF" desc="Convert Microsoft Word documents to professional PDF files instantly." />
      </Route>
      <Route path="/tools/excel-to-pdf">
        <GenericPdfTool title="Excel to PDF" desc="Turn Excel spreadsheets into high-quality PDF documents." />
      </Route>
      <Route path="/tools/ppt-to-pdf">
        <GenericPdfTool title="PPT to PDF" desc="Convert PowerPoint presentations to PDF slides securely." />
      </Route>
      <Route path="/tools/pdf-to-word">
        <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Microsoft Word files." />
      </Route>
      <Route path="/tools/pdf-to-excel">
        <GenericPdfTool title="PDF to Excel" desc="Extract tables from PDF into editable Excel sheets." />
      </Route>
      <Route path="/tools/epub-to-pdf">
        <GenericPdfTool title="EPUB to PDF" desc="Convert EPUB e-books to standard PDF format for any device." />
      </Route>
      <Route path="/tools/mobi-to-pdf">
        <GenericPdfTool title="MOBI to PDF" desc="Convert Kindle MOBI files to PDF documents easily." />
      </Route>
      <Route path="/tools/pdf-to-epub">
        <GenericPdfTool title="PDF to EPUB" desc="Transform PDF documents into reflowable EPUB e-books." />
      </Route>
      <Route path="/tools/csv-to-json">
        <GenericPdfTool title="CSV to JSON" desc="Convert structured CSV data into JSON format for developers." />
      </Route>
      <Route path="/tools/json-to-excel">
        <GenericPdfTool title="JSON to Excel" desc="Transform JSON data into organized Excel spreadsheets." />
      </Route>
      <Route path="/tools/xml-to-json">
        <GenericPdfTool title="XML to JSON" desc="Convert XML data structures into easy-to-use JSON format." />
      </Route>
      <Route path="/tools/html-to-pdf">
        <GenericPdfTool title="HTML to PDF" desc="Save any web page or HTML code as a high-quality PDF." />
      </Route>
      <Route path="/tools/extract-zip">
        <GenericPdfTool title="Extract ZIP" desc="Uncompress and extract files from ZIP archives online." />
      </Route>
      <Route path="/tools/create-zip">
        <GenericPdfTool title="Create ZIP" desc="Compress multiple files into a single secure ZIP archive." />
      </Route>

      {/* Other Tools Ext */}
      <Route path="/tools/qr-generator">
        <GenericPdfTool title="QR Code Generator" desc="Create custom QR codes for URLs, text, or contact info." />
      </Route>
      <Route path="/tools/lorem-ipsum">
        <GenericPdfTool title="Lorem Ipsum Generator" desc="Generate placeholder text for your design projects." />
      </Route>
      <Route path="/tools/meme-maker">
        <GenericPdfTool title="Meme Maker" desc="Create funny memes from your images easily." />
      </Route>
      <Route path="/tools/create-zip">
        <GenericPdfTool title="Create Zip" desc="Compress multiple files into a single ZIP archive." />
      </Route>
      <Route path="/tools/epoch-converter">
        <GenericPdfTool title="Epoch Converter" desc="Convert Unix timestamps to human-readable dates." />
      </Route>

      {/* AI Write Ext */}
      <Route path="/tools/story-generator">
        <GenericPdfTool title="Story Generator" desc="Generate creative stories and narratives using AI." />
      </Route>
      <Route path="/tools/content-summarizer">
        <GenericPdfTool title="Content Summarizer" desc="Summarize long articles and documents into key points." />
      </Route>
      <Route path="/tools/ai-humanizer">
        <GenericPdfTool title="AI Humanizer" desc="Rewrite AI text to sound more natural and human-like." />
      </Route>
      <Route path="/tools/tone-of-voice">
        <GenericPdfTool title="Tone of Voice" desc="Analyze and adjust the tone of your writing." />
      </Route>

      {/* PDF Tools Ext */}
      <Route path="/tools/pdf-to-excel">
        <GenericPdfTool title="PDF to Excel" desc="Extract tables from PDF into editable Excel sheets." />
      </Route>
      <Route path="/tools/pdf-to-powerpoint">
        <GenericPdfTool title="PDF to PowerPoint" desc="Convert PDF presentations into editable PPTX slides." />
      </Route>
      <Route path="/tools/png-to-pdf">
        <GenericPdfTool title="PNG to PDF" desc="Convert PNG images into high-quality PDF files." />
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