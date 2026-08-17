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
  },
  "rotate pdf": {
    title: "Rotate PDF Pages Online",
    description: "Turn sideways or upside-down pages the right way up and save the corrected orientation permanently into your PDF.",
    howTo: [
      "Upload the PDF containing pages that display at the wrong angle.",
      "Choose a rotation of 90°, 180°, or 270° and apply it to every page or only the ones you select.",
      "Download the corrected file — the new orientation is written into the document, not just the viewer."
    ],
    useCases: "Scanned contracts often come out sideways when the feeder pulls a page in landscape. Phone-photographed receipts arrive upside down. Rotating once and saving means colleagues no longer have to tilt their heads or re-rotate the file every time they open it.",
    faqs: [
      { q: "Does rotating reduce quality?", a: "No. Rotation changes a page attribute rather than re-rendering the content, so text stays selectable and images keep their original resolution." },
      { q: "Can I rotate only some pages?", a: "Yes. Apply the rotation to the whole document or pick individual pages when the scan mixed orientations." },
      { q: "Why did my viewer show it correctly but printing came out sideways?", a: "Some viewers apply a temporary on-screen rotation that is never saved. Rotating here writes the change into the file itself, so printers and other viewers respect it." }
    ]
  },
  "page numbers": {
    title: "Add Page Numbers to PDF",
    description: "Insert clean, consistent page numbers into any PDF. Choose the position and starting number without touching the original layout.",
    howTo: [
      "Upload the PDF you want to paginate.",
      "Pick where numbers should sit and which number the sequence starts from.",
      "Download the numbered document, ready to print or submit."
    ],
    useCases: "Required for court filings, thesis submissions, and tender documents where reviewers cite page numbers. Also useful after merging several files, when the combined document has no continuous numbering of its own.",
    faqs: [
      { q: "Can I start numbering from a page other than the first?", a: "Yes. Set a different starting number when your document has a cover page or front matter that should not be counted." },
      { q: "Will numbers overlap my existing content?", a: "Numbers are placed in the margin. If your document already has content running to the very edge of the page, check the result before submitting." },
      { q: "Can the numbers be removed later?", a: "Not from the output file — they become part of the page. Keep your original if you may need an unnumbered version." }
    ]
  },
  "remove pages": {
    title: "Delete Pages from PDF",
    description: "Remove unwanted pages from a PDF and download a clean copy. Blank scans, duplicates, and internal notes gone in seconds.",
    howTo: [
      "Upload the PDF you want to trim.",
      "Enter the page numbers or ranges to remove — for example 3, 7-9.",
      "Download the new file containing only the pages you kept."
    ],
    useCases: "Duplex scanners produce a blank page for every single-sided sheet. Reports circulated externally often need internal cover notes or pricing appendices stripped out before sending.",
    faqs: [
      { q: "Is my original file changed?", a: "No. You download a new PDF and your original stays exactly as it was on your device." },
      { q: "What happens to the bookmarks pointing at deleted pages?", a: "Bookmarks that referenced removed pages no longer resolve. Check your table of contents after deleting from a structured document." },
      { q: "Can I delete a page range in one go?", a: "Yes. Enter a range like 12-18 rather than listing every page individually." }
    ]
  },
  "reorder pages": {
    title: "Reorder PDF Pages",
    description: "Move pages into the sequence you actually need. Drag them into place and save the new order permanently.",
    howTo: [
      "Upload the PDF whose page order needs fixing.",
      "Set the sequence you want by rearranging the pages.",
      "Download the reordered document."
    ],
    useCases: "Sheet-fed scanners frequently reverse page order or pull sheets out of sequence. Appendices sometimes need to move ahead of a summary before a document goes to a client.",
    faqs: [
      { q: "Do page numbers already printed on the pages update?", a: "No. Numbers printed into the page content move with the page. If you need a fresh sequence, use the Add Page Numbers tool after reordering." },
      { q: "Can I reverse the whole document at once?", a: "Yes — specify the reverse sequence and every page flips order in a single pass, which is the usual fix for a back-to-front scan." }
    ]
  },
  "edit pdf": {
    title: "Edit PDF Online",
    description: "Make direct changes to a PDF in your browser — adjust pages, add elements, and save the result without any desktop software.",
    howTo: [
      "Upload the PDF you want to change.",
      "Apply your edits using the available page and content controls.",
      "Download the edited document."
    ],
    useCases: "Handy for last-minute fixes when the source file is gone: correcting a date on a form, adding a note to a page, or adjusting a document you received rather than created.",
    faqs: [
      { q: "Can I rewrite paragraphs of existing text?", a: "PDFs store text as positioned glyphs rather than flowing paragraphs, so full reflow editing is limited. For heavy rewriting, convert to Word first, edit there, then convert back." },
      { q: "Will my fonts change?", a: "Fonts embedded in the original are preserved. Content you add uses a standard embedded font so it renders the same on every device." }
    ]
  },
  "crop pdf": {
    title: "Crop PDF Margins",
    description: "Trim excess white space and unwanted edges from PDF pages so the content fills the page properly.",
    howTo: [
      "Upload the PDF with margins you want to reduce.",
      "Set the crop area to keep.",
      "Download the cropped document."
    ],
    useCases: "Academic papers scanned from journals carry wide margins that waste space when printed or read on a tablet. Cropping makes text noticeably larger on small screens without changing the font.",
    faqs: [
      { q: "Is the cropped content deleted?", a: "Cropping adjusts the visible page box. Depending on the viewer, hidden content may still exist in the file, so do not rely on cropping to redact sensitive information." },
      { q: "How do I redact something properly?", a: "Delete the page entirely, or remove the sensitive content before the PDF is generated. A crop is a display change, not a security measure." }
    ]
  },
  "repair pdf": {
    title: "Repair Corrupted PDF",
    description: "Attempt recovery of PDF files that fail to open, show errors, or render as blank pages by rebuilding their internal structure.",
    howTo: [
      "Upload the PDF that will not open correctly.",
      "The tool parses the file and rebuilds its structure where possible.",
      "Download the repaired copy and confirm it opens."
    ],
    useCases: "Files damaged by an interrupted download, a failing USB drive, or a crash during export sometimes carry a broken cross-reference table while the page content is still intact. Rebuilding that structure can make them readable again.",
    faqs: [
      { q: "Will every damaged file be recoverable?", a: "No. Structural damage is often repairable; if the page data itself was overwritten or truncated, the content is genuinely gone and no tool can bring it back." },
      { q: "What if repair does not work?", a: "Try re-downloading or re-exporting from the original source. A fresh copy is almost always better than a partially recovered one." },
      { q: "Could repairing lose formatting?", a: "Rebuilding may drop some interactive elements such as form fields or annotations while preserving the visible page content. Compare the result against what you expected." }
    ]
  },
  "flatten pdf": {
    title: "Flatten PDF Layers and Forms",
    description: "Merge form fields, annotations, and layers into the page itself so the document looks identical everywhere and can no longer be edited.",
    howTo: [
      "Upload the PDF containing form fields, comments, or layers.",
      "Flatten the document so those elements become part of the page content.",
      "Download the flattened file."
    ],
    useCases: "A filled-in form still holds editable fields, meaning the recipient can change your answers. Flattening before sending locks the values in. It also stops comments from being rearranged and prevents layered artwork from displaying differently in another viewer.",
    faqs: [
      { q: "Can a flattened PDF be edited again?", a: "The flattened elements no longer behave as fields or annotations. Keep your original if you may need to revise the entries later." },
      { q: "Does flattening make the file secure?", a: "It prevents casual editing of fields, but it is not encryption. Use Protect PDF if you need password protection." },
      { q: "Why does my form look right on screen but print empty?", a: "Some viewers show field values without printing them. Flattening writes the values into the page so they always print." }
    ]
  },
  "pdf to excel": {
    title: "Convert PDF Tables to Excel",
    description: "Pull tables out of a PDF into a spreadsheet you can sort, filter, and calculate with, instead of retyping the figures by hand.",
    howTo: [
      "Upload the PDF containing the table you need.",
      "The tool detects the tabular structure and maps rows and columns.",
      "Download the spreadsheet and check the totals before you rely on them."
    ],
    useCases: "Bank statements, supplier price lists, and monthly financial reports arrive as PDFs but need to be summed, filtered, or charted. Converting rather than retyping removes the transcription errors that creep into hand-keyed figures.",
    faqs: [
      { q: "How accurate is the conversion?", a: "Tables with clear ruled lines and consistent columns convert well. Merged cells, multi-line rows, and footnotes inside the table often need manual tidying afterwards." },
      { q: "Will it work on a scanned PDF?", a: "A scan is an image, so there is no table structure to read. Run OCR PDF first to make the text machine-readable, then convert." },
      { q: "Why are some numbers stored as text?", a: "Currency symbols, thousands separators, and trailing spaces stop Excel recognising a value as numeric. Use Excel's Text to Columns to clean the affected column." }
    ]
  },
  "pdf to ppt": {
    title: "Convert PDF to PowerPoint",
    description: "Turn a PDF deck back into editable PowerPoint slides so you can update figures and reuse the layout.",
    howTo: [
      "Upload the PDF version of the presentation.",
      "Each PDF page is mapped to a slide.",
      "Download the PPTX and open it in PowerPoint, Keynote, or Google Slides."
    ],
    useCases: "Common when a colleague sends the exported PDF but not the source deck, or when an old presentation needs its numbers updated before being shown again.",
    faqs: [
      { q: "Will animations come back?", a: "No. Animations and slide transitions are not stored in a PDF, so they cannot be recovered. Only the visible content of each slide is reconstructed." },
      { q: "Are the text boxes editable?", a: "Text that was stored as text in the PDF becomes editable. Anything that was flattened to an image stays an image." },
      { q: "Why do my fonts look different?", a: "If a font was not embedded in the PDF, PowerPoint substitutes the closest available one. Installing the original font before opening the file usually fixes the spacing." }
    ]
  },
  "pdf to jpg": {
    title: "Convert PDF Pages to JPG Images",
    description: "Export every page of a PDF as a standalone JPG image, ready for slides, web pages, or messaging apps.",
    howTo: [
      "Upload the PDF you want to turn into images.",
      "Each page is rendered as a separate JPG.",
      "Download the images individually or as a single package."
    ],
    useCases: "Useful when a platform will not accept PDFs — most social networks, many web forms, and messaging apps take images only. Also handy for dropping a single page into a presentation without embedding the whole document.",
    faqs: [
      { q: "Will the text stay sharp?", a: "Pages are rendered at a resolution suitable for on-screen viewing. For print work, PDF to PNG produces cleaner edges around text and line art." },
      { q: "JPG or PNG — which should I pick?", a: "JPG for pages that are mostly photographs, PNG for pages dominated by text, charts, or diagrams where JPG compression softens fine detail." },
      { q: "Can I export only one page?", a: "Use Split PDF to isolate the page you need, then convert that single-page file." }
    ]
  },
  "pdf to text": {
    title: "Extract Text from PDF",
    description: "Pull the plain text out of a PDF into a .txt file, stripped of layout, images, and formatting.",
    howTo: [
      "Upload the PDF you want to read the text from.",
      "The text layer is extracted in reading order.",
      "Download the .txt file."
    ],
    useCases: "Useful when you need the words rather than the presentation: feeding a document into a search index, checking word counts, quoting passages, or preparing text for translation.",
    faqs: [
      { q: "Nothing was extracted — why?", a: "The PDF is almost certainly a scan, meaning the pages are images with no text layer. Run OCR PDF first to generate one." },
      { q: "Why is the column order jumbled?", a: "Multi-column layouts are stored as positioned text, and extraction follows the internal order rather than the visual columns. Newspapers and academic papers often need manual reordering." },
      { q: "Are tables preserved?", a: "No. Table structure is lost because a .txt file has no concept of rows and columns. Use PDF to Excel when the layout matters." }
    ]
  },
  "pdf to pdf/a": {
    title: "Convert PDF to PDF/A",
    description: "Produce a PDF/A file — the archival standard that keeps a document readable decades from now by embedding everything it depends on.",
    howTo: [
      "Upload the PDF you need in archival format.",
      "Fonts and colour information are embedded and non-conforming elements are resolved.",
      "Download the PDF/A file."
    ],
    useCases: "Court e-filing systems, government tender portals, university thesis repositories, and long-term corporate records commonly require PDF/A and reject ordinary PDFs at upload.",
    faqs: [
      { q: "How is PDF/A different from a normal PDF?", a: "PDF/A forbids anything whose rendering depends on the outside world — external font references, JavaScript, encryption, embedded video — so the file always displays the same way." },
      { q: "Will my file get bigger?", a: "Usually yes, because every font used must be fully embedded rather than referenced. That size increase is what makes the file self-contained." },
      { q: "Can I still edit a PDF/A?", a: "You can, but editing may break conformance. Validate again after any change if the file must remain compliant." }
    ]
  },
  "ocr pdf": {
    title: "OCR PDF — Make Scans Searchable",
    description: "Run optical character recognition over a scanned PDF so its text becomes selectable, searchable, and copyable.",
    howTo: [
      "Upload the scanned PDF or image-based document.",
      "Characters are recognised and a text layer is added beneath the original page image.",
      "Download the searchable PDF."
    ],
    useCases: "Archived contracts, old invoices, and scanned books are unusable until they can be searched. OCR is also the required first step before PDF to Text, PDF to Word, or PDF to Excel will return anything from a scan.",
    faqs: [
      { q: "Does OCR change how the page looks?", a: "No. The original image stays exactly as it was and the recognised text sits invisibly behind it, so the document looks identical but is now searchable." },
      { q: "How accurate is it?", a: "Clean 300 DPI scans of printed text typically recognise very well. Faint photocopies, skewed pages, unusual fonts, and handwriting produce noticeably more errors." },
      { q: "Can it read handwriting?", a: "OCR is built for printed characters. Handwritten notes give poor and unreliable results." }
    ]
  },
  "word to pdf": {
    title: "Convert Word to PDF",
    description: "Turn a DOC or DOCX file into a PDF that keeps your layout intact on every device and printer.",
    howTo: [
      "Upload your .doc or .docx file.",
      "The document is rendered with its fonts, spacing, and page breaks preserved.",
      "Download the PDF."
    ],
    useCases: "Sending a Word file means the recipient may see different fonts, shifted page breaks, and a broken layout — and they can edit it. A PDF locks the presentation, which is why CVs, invoices, and signed agreements are almost always sent this way.",
    faqs: [
      { q: "Will my formatting survive?", a: "Standard text, tables, headings, and images convert reliably. Very complex layouts with floating text boxes or unusual fonts are worth checking before sending." },
      { q: "Do hyperlinks still work?", a: "Yes, links in the Word document remain clickable in the PDF." },
      { q: "What file size can I upload?", a: "Documents up to 20 MB. If yours is larger, compressing the images inside the Word file first usually brings it under the limit." }
    ]
  },
  "ppt to pdf": {
    title: "Convert PowerPoint to PDF",
    description: "Export a PPT or PPTX presentation as a PDF that opens correctly for anyone, with fonts and layout locked in place.",
    howTo: [
      "Upload your .ppt or .pptx presentation.",
      "Each slide is rendered as one PDF page.",
      "Download the PDF."
    ],
    useCases: "Sharing a deck with people who do not have PowerPoint, submitting slides to a conference that requires PDF, or sending a presentation you do not want edited before a meeting.",
    faqs: [
      { q: "What happens to animations?", a: "PDF is a static format, so animations and transitions are dropped. Each slide appears in its final state." },
      { q: "Are speaker notes included?", a: "No. Only the slide content is exported, which is usually what you want when sharing externally." },
      { q: "Why do my custom fonts look different?", a: "Fonts are embedded during conversion where licensing allows. A font that cannot be embedded is substituted, which may shift spacing slightly." }
    ]
  },
};