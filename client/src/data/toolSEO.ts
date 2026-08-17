export interface ToolSEOData {
  title: string;
  description: string;
  howTo: string[];
  useCases: string;
  faqs: { q: string; a: string }[];
}

export const TOOL_SEO_DATA: Record<string, ToolSEOData> = {
  "merge pdf": {
    title: "Merge PDF Files Online",
    description: "Combine multiple PDF documents into a single organized file in seconds. Rearrange pages easily without losing original quality.",
    howTo: [
      "Upload two or more PDF files using the drag-and-drop zone.",
      "Reorder the uploaded documents by dragging them into your preferred sequence.",
      "Click 'Merge PDF' to generate and download your combined document."
    ],
    useCases: "Ideal for combining monthly financial reports, student assignments, legal contracts, or multi-part invoices into a single streamlined file.",
    faqs: [
      { q: "How many PDF files can I merge at once?", a: "You can merge up to 20 PDF files simultaneously completely free of charge." },
      { q: "Will the original file quality be affected?", a: "No, all text, images, and formatting remain exactly as they were in the original documents." }
    ]
  },
  "split pdf": {
    title: "Split PDF Pages Instantly",
    description: "Extract specific pages or separate a large PDF document into smaller individual files. Fast, secure, and precise page selection.",
    howTo: [
      "Select and upload the PDF file you wish to split.",
      "Specify the exact page numbers or ranges you want to extract.",
      "Click 'Split PDF' to download your extracted pages as separate files or a ZIP package."
    ],
    useCases: "Perfect for extracting a single chapter from an e-book, isolating specific invoice pages, or sharing only relevant document sections.",
    faqs: [
      { q: "Can I split password-protected PDFs?", a: "You will need to unlock or provide the password for encrypted PDFs before splitting." },
      { q: "Is there a limit on the file size?", a: "You can upload files up to 20MB for immediate browser-based splitting." }
    ]
  },
  "pdf to word": {
    title: "Convert PDF to Editable Word Document",
    description: "Transform your static PDF files into fully editable Microsoft Word (.docx) documents while preserving text, fonts, and paragraph layouts.",
    howTo: [
      "Upload your PDF document to the converter tool.",
      "Wait a few seconds while our engine parses the layout and typography.",
      "Download your editable DOCX file and open it in Word or Google Docs."
    ],
    useCases: "Essential for editing old contracts, tweaking resume details when source files are lost, or reusing PDF content in report drafts.",
    faqs: [
      { q: "Does it support scanned PDF files?", a: "Text-based PDFs convert instantly. Scanned image PDFs require clear text formatting for optimal accuracy." }
    ]
  }
};