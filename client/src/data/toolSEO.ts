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
  "jpg to pdf": {
    title: "Convert JPG Images to PDF",
    description: "Turn photos and scans into a single PDF document. Combine several images into one file with each picture on its own page.",
    howTo: [
      "Upload one or more JPG, PNG, WebP, GIF, or BMP images.",
      "Arrange them in the order you want them to appear.",
      "Download the PDF — each image becomes a page."
    ],
    useCases: "Photographed receipts for an expense claim, ID documents requested as a single PDF, or a set of scanned pages that need to travel as one file rather than a folder of loose images.",
    faqs: [
      { q: "Can I combine several photos into one PDF?", a: "Yes. Upload them together and each image is placed on its own page in the order you set." },
      { q: "Is the image quality reduced?", a: "Images are embedded at their original resolution. A PDF made from phone photos will be large, so run Compress PDF afterwards if you need to email it." },
      { q: "Conversion happens where?", a: "In your browser. The images are never uploaded to a server, which is worth knowing when the photos are of personal documents." }
    ]
  },
  "html to pdf": {
    title: "Convert HTML to PDF",
    description: "Render an HTML file into a PDF that preserves the page as it appears, ready to archive or share.",
    howTo: [
      "Upload your .html or .htm file.",
      "The page is rendered and paginated.",
      "Download the PDF."
    ],
    useCases: "Archiving a saved web page, turning an HTML invoice template into a sendable document, or capturing a report generated by a web application in a fixed format.",
    faqs: [
      { q: "Are external images and stylesheets included?", a: "Resources referenced by absolute URLs may not resolve during conversion. Pages that embed their styles and images inline convert most reliably." },
      { q: "Can I convert a live website by URL?", a: "No — this tool takes an uploaded file. Save the page from your browser first, then upload the saved HTML." },
      { q: "Does JavaScript run?", a: "Content generated by scripts after page load may not appear. Static markup converts predictably." }
    ]
  },
  "compress pdf": {
    title: "Compress PDF File Size",
    description: "Reduce the size of a PDF so it fits email attachment limits and upload forms, while keeping the document readable.",
    howTo: [
      "Upload the PDF that is too large to send.",
      "The document structure is optimised and redundant data removed.",
      "Download the smaller file and check it still reads well."
    ],
    useCases: "Most mail servers reject attachments over 10 MB and many government upload forms cap at 5 MB. Scanned documents and image-heavy reports are the usual offenders.",
    faqs: [
      { q: "How much smaller will my file get?", a: "It depends entirely on what is inside. Text-heavy PDFs are already efficient and may barely shrink; files padded with redundant objects or duplicated resources can drop substantially." },
      { q: "My file barely changed — why?", a: "If the bulk is high-resolution scanned images, the savings come from re-encoding those images rather than from structural optimisation. Rescanning at 200-300 DPI usually helps more." },
      { q: "Is text still selectable afterwards?", a: "Yes. Compression here works on the file structure and does not flatten your text into images." }
    ]
  },
  "unlock pdf": {
    title: "Remove PDF Restrictions",
    description: "Open a restricted PDF and save an unrestricted copy so you can print, copy text, and edit normally.",
    howTo: [
      "Upload the PDF that blocks printing or copying.",
      "The restrictions are removed where the file permits it.",
      "Download the unrestricted copy."
    ],
    useCases: "Documents distributed with permission flags set often block printing or text selection even though you are entitled to use them — your own bank statements, an e-book you bought, a report your company produced.",
    faqs: [
      { q: "Does this work on a PDF that asks for a password to open?", a: "No. A file encrypted with an open password cannot be read at all without that password, and no tool can bypass that. This removes permission restrictions on files that already open." },
      { q: "Is removing restrictions legal?", a: "Use it only on documents you own or have the right to use. Circumventing protection on material you do not have rights to may breach copyright law where you live." },
      { q: "Will the content change?", a: "No. Pages, text, and images stay exactly as they were — only the permission flags are cleared." }
    ]
  },
  "add watermark": {
    title: "Add Watermark to PDF",
    description: "Stamp custom text across every page of a PDF, with control over size, angle, opacity, and colour.",
    howTo: [
      "Upload the PDF you want to mark.",
      "Enter your watermark text and adjust the font size, rotation angle, opacity, and colour.",
      "Download the watermarked document."
    ],
    useCases: "Marking a document DRAFT so nobody circulates it as final, adding CONFIDENTIAL before sharing externally, or putting your studio name across proofs sent to a client for review.",
    faqs: [
      { q: "Can I change how visible the watermark is?", a: "Yes. Opacity is adjustable — a low value sits faintly behind the text, a higher one makes the mark unmistakable." },
      { q: "Can the watermark be removed afterwards?", a: "It becomes part of the page content, so it is not removable from the output. Keep your original clean copy." },
      { q: "Does the watermark appear on every page?", a: "Yes, it is applied across the whole document in a single pass." }
    ]
  },
  "compare pdf": {
    title: "Compare Two PDF Documents",
    description: "Upload two PDFs and see what changed between them, so you do not have to read both versions side by side.",
    howTo: [
      "Upload the original document as the first file.",
      "Upload the revised version as the second file.",
      "Review the differences that are reported between them."
    ],
    useCases: "Checking what a counterparty altered in a returned contract, confirming which clauses moved between two drafts, or verifying that a resubmitted report contains the corrections you asked for.",
    faqs: [
      { q: "What size files can I compare?", a: "Up to 10 MB each, two files at a time." },
      { q: "Will it catch formatting changes?", a: "The comparison focuses on textual differences. A change in font or spacing that leaves the words identical will not be flagged." },
      { q: "Can I compare scanned documents?", a: "Scans hold no text layer, so there is nothing to compare. Both files need real text for the comparison to mean anything." }
    ]
  },
  "translate pdf": {
    title: "Translate PDF Documents",
    description: "Translate the text of a PDF into another language and get the result back as a document you can read and share.",
    howTo: [
      "Upload the PDF you need translated.",
      "Choose your target language from the supported list.",
      "Download the translated document."
    ],
    useCases: "Understanding a supplier contract that arrived in a language you do not read, reviewing a foreign technical manual, or preparing a rough version of a document for a colleague abroad.",
    faqs: [
      { q: "Which languages are supported?", a: "Turkish, English, German, French, Spanish, Italian, Portuguese, Russian, Japanese, Chinese, Arabic, Korean, Dutch, Polish, and Swedish." },
      { q: "Is the translation good enough for legal use?", a: "No. This is machine translation and it is reliable for understanding the gist, not for contracts or filings. Anything binding needs a certified human translator." },
      { q: "Does the original layout survive?", a: "The text is translated and returned in document form, but complex multi-column layouts and precise positioning may shift, since translated text rarely occupies the same space as the original." }
    ]
  },
  "compress video": {
    title: "Compress Video Online",
    description: "Shrink large video files so they fit upload limits and send over messaging apps, with quality you control.",
    howTo: [
      "Upload the video that is too large to share.",
      "Choose your quality level — lower settings produce smaller files.",
      "Wait for encoding to finish, then download the compressed video."
    ],
    useCases: "WhatsApp caps video at 16 MB and email attachments rarely survive past 25 MB. A two-minute phone clip at 4K can easily exceed both, and compressing is the difference between sending it and not.",
    faqs: [
      { q: "Where does the compression happen?", a: "Entirely in your browser using WebAssembly. The video never leaves your device, which matters for personal footage." },
      { q: "Why is it slower than a desktop app?", a: "Browser-based encoding cannot use your graphics card the way native software does. A large file may take several minutes — keep the tab open while it runs." },
      { q: "What size file can I process?", a: "Encoding runs in your browser's memory, so very large files can exhaust it. Clips under a few hundred megabytes are the safe range; trim longer footage first." }
    ]
  },
  "video to gif": {
    title: "Convert Video to GIF",
    description: "Turn a video clip into an animated GIF that plays automatically anywhere images are supported.",
    howTo: [
      "Upload your video file.",
      "Set the section and settings you want for the animation.",
      "Download the GIF."
    ],
    useCases: "Bug reports where a short GIF shows the problem better than three paragraphs, product demos embedded in documentation, and reaction clips for chat platforms that autoplay GIFs but not video.",
    faqs: [
      { q: "Why is my GIF larger than the original video?", a: "GIF compresses far less efficiently than modern video codecs and stores no audio. Keeping the clip short and the frame rate modest is the main way to control size." },
      { q: "Does the audio carry over?", a: "No. The GIF format has no audio track, so sound is dropped." },
      { q: "How long should the clip be?", a: "Under about ten seconds. Longer animations produce very large files that load slowly." }
    ]
  },
  "video to mp3": {
    title: "Extract Audio from Video as MP3",
    description: "Pull the audio track out of a video file and save it as an MP3 you can listen to anywhere.",
    howTo: [
      "Upload the video containing the audio you want.",
      "The audio track is extracted and encoded to MP3.",
      "Download the MP3 file."
    ],
    useCases: "Saving a recorded lecture or interview as audio for listening on the move, keeping the soundtrack from footage you shot, or pulling narration out of a video for transcription.",
    faqs: [
      { q: "Does extraction reduce audio quality?", a: "The audio is re-encoded to MP3, which is lossy. The result is close to the source for speech and most music, but it is not a bit-perfect copy." },
      { q: "Does the video stay on my device?", a: "Yes. Extraction runs in your browser, so nothing is uploaded." },
      { q: "Can I extract from any video format?", a: "Common formats including MP4, MOV, WebM, and AVI work. Very unusual codecs may not decode in the browser." }
    ]
  },
  "mp4 to webm": {
    title: "Convert MP4 to WebM",
    description: "Re-encode an MP4 into WebM, the open format built for the web that usually produces smaller files at similar quality.",
    howTo: [
      "Upload your MP4 file.",
      "The video is re-encoded to WebM.",
      "Download the converted file."
    ],
    useCases: "Web developers embedding video with HTML5 often ship WebM for better compression, and some platforms accept WebM but reject MP4 for licensing reasons.",
    faqs: [
      { q: "Will the file get smaller?", a: "Usually. WebM's VP8 and VP9 codecs typically achieve better compression than older H.264 encodes at comparable quality." },
      { q: "Does WebM play everywhere?", a: "All current desktop and mobile browsers support it. Older devices and some smart TVs do not, so keep an MP4 fallback if broad compatibility matters." },
      { q: "How long does conversion take?", a: "Re-encoding is computationally heavy and runs in your browser, so expect several minutes for a long clip." }
    ]
  },
  "mute video": {
    title: "Remove Audio from Video",
    description: "Strip the sound from a video and keep the picture, without re-encoding the visuals.",
    howTo: [
      "Upload the video whose audio you want gone.",
      "The audio track is removed while the video stream is copied as-is.",
      "Download the silent video."
    ],
    useCases: "Background conversation caught on a clip you want to post, replacing original sound with music later, or preparing a looping video for a website where autoplay only works when muted.",
    faqs: [
      { q: "Does muting hurt video quality?", a: "No. The video stream is copied without re-encoding, so the picture is bit-for-bit identical to the original." },
      { q: "Can I get the audio back?", a: "Not from the muted file. Keep your original if you may want the sound later." },
      { q: "Why is this so much faster than compressing?", a: "Nothing has to be re-encoded — the audio track is simply dropped and the video passed through untouched." }
    ]
  },
  "video resizer": {
    title: "Resize Video Dimensions",
    description: "Change a video's pixel dimensions — scale it down to 1080p, 720p, 480p or 360p, or fit it to a square or vertical frame for social platforms.",
    howTo: [
      "Upload your video file.",
      "Pick a target size: a height that keeps the original shape, or a 1:1 / 9:16 frame for social.",
      "Download the resized video — the before and after dimensions are shown so you can check the change."
    ],
    useCases: "A 4K phone clip is far larger than any feed needs; dropping it to 720p cuts the file size without a visible difference on a phone screen. The 1:1 and 9:16 presets matter when a platform crops or letterboxes anything that arrives in the wrong shape.",
    faqs: [
      { q: "Does this crop the picture?", a: "No. The height presets scale the whole frame and keep the original aspect ratio. The 1:1 and 9:16 presets pad the video with black bars rather than cutting anything off. To cut a section out, use Trim Video instead." },
      { q: "Can I make a small video bigger?", a: "No, and deliberately so. Picking 1080p for a 480p clip leaves it at 480p. Upscaling invents pixels that were never recorded and makes the file larger without making it look better." },
      { q: "Is quality lost?", a: "Re-encoding is lossy by nature. Starting from the highest-quality source you have keeps the loss minimal." },
      { q: "How long does it take?", a: "Encoding runs in your browser, so a long or high-resolution clip may take several minutes. Leave the tab open." }
    ]
  },
  "rotate video": {
    title: "Rotate Video Orientation",
    description: "Fix footage that plays sideways or upside down and save the corrected orientation into the file.",
    howTo: [
      "Upload the video with the wrong orientation.",
      "Choose a rotation of 90°, 180°, or 270°.",
      "Download the corrected video."
    ],
    useCases: "Phones record orientation as metadata, and some players ignore it — footage that looked upright on your phone ends up sideways once uploaded. Rotating and re-saving fixes it for every player.",
    faqs: [
      { q: "Why did my video look fine on my phone but rotate after uploading?", a: "Phones store a rotation flag rather than rotating the actual frames. Players that ignore the flag show the raw orientation. Rotating here writes the change into the frames themselves." },
      { q: "Does rotating reduce quality?", a: "Rotation requires re-encoding, so there is a small quality cost. It is not usually visible at normal viewing sizes." },
      { q: "Can I rotate by an arbitrary angle?", a: "No — 90, 180, and 270 degrees only. Other angles would leave empty corners in the frame." }
    ]
  },
  "trim video": {
    title: "Trim and Cut Video",
    description: "Cut a video down to the section you actually need by setting a start and end point.",
    howTo: [
      "Upload the video you want to shorten.",
      "Set the start and end times of the section to keep.",
      "Download the trimmed clip."
    ],
    useCases: "Removing dead air at the start of a screen recording, isolating the one relevant minute from a long meeting capture, or cutting a clip to fit a platform's duration limit.",
    faqs: [
      { q: "Can I remove a section from the middle?", a: "A single trim keeps one continuous range. To drop a middle section, export the two parts separately and join them in a video editor." },
      { q: "Is the cut frame-accurate?", a: "Cuts land on the nearest keyframe, which can put the boundary a fraction of a second off your exact mark. Setting the start slightly early gives a safer result." },
      { q: "Does trimming re-encode the video?", a: "Trimming is much lighter than full compression and completes quickly even on longer files." }
    ]
  },
  "image to webp": {
    title: "Convert Images to WebP",
    description: "Convert JPG, PNG, or HEIC images to WebP, the modern format that keeps quality at a fraction of the file size.",
    howTo: [
      "Upload the image you want to convert.",
      "Adjust the quality setting if you need a specific balance.",
      "Download the WebP file."
    ],
    useCases: "Page speed is a ranking factor, and images are usually the heaviest thing on a page. Switching product photos and hero images to WebP often cuts total page weight substantially without a visible difference.",
    faqs: [
      { q: "How much smaller are WebP files?", a: "Typically 25-35% smaller than an equivalent JPG at the same perceived quality, with bigger savings on graphics and screenshots." },
      { q: "Does WebP work everywhere?", a: "Every current browser supports it. Very old software and some legacy email clients do not, so keep originals if your audience might be on outdated systems." },
      { q: "Does my image get uploaded?", a: "No. Conversion runs in your browser through the Canvas API — the file never leaves your device." }
    ]
  },
  "remove background": {
    title: "Remove Image Background",
    description: "Separate the subject from its background and download a clean cut-out with transparency.",
    howTo: [
      "Upload the image containing the subject you want isolated.",
      "The background is detected and removed.",
      "Download the result with a transparent background."
    ],
    useCases: "Product photos for a marketplace listing that requires a plain background, profile pictures that need to sit on a coloured card, and graphics being placed over a different backdrop.",
    faqs: [
      { q: "What kind of images work best?", a: "A clearly defined subject against a contrasting background. Fine detail like loose hair, fur, or transparent objects such as glass is where automatic removal struggles most." },
      { q: "What format is the output?", a: "PNG, because it supports transparency. Saving as JPG would fill the transparent area with white." },
      { q: "Can I clean up the edges afterwards?", a: "Download the result and touch it up in any image editor if the cut-out needs refining around difficult areas." }
    ]
  },
  "heic to jpg": {
    title: "Convert HEIC to JPG",
    description: "Convert iPhone HEIC photos into JPG files that open on any device and upload to any website.",
    howTo: [
      "Upload one or more .heic files from your iPhone or iPad.",
      "Each image is decoded and re-encoded as JPG.",
      "Download the converted photos."
    ],
    useCases: "iPhones save photos as HEIC by default, and Windows, older Android devices, and most web upload forms reject the format outright. Converting is often the only way to attach a photo to a form or share it with a colleague.",
    faqs: [
      { q: "Why can't Windows open my HEIC photos?", a: "HEIC needs a codec that Windows does not ship with by default. Converting to JPG sidesteps the problem entirely." },
      { q: "Will the photo lose quality?", a: "JPG is lossy, so there is a small loss, though it is not visible at normal viewing sizes. HEIC files are also typically about half the size of the resulting JPG." },
      { q: "Can I stop my iPhone saving HEIC?", a: "Settings → Camera → Formats → Most Compatible makes the phone save JPG directly." }
    ]
  },
  "webp to jpg": {
    title: "Convert WebP to JPG",
    description: "Turn WebP images into universally supported JPG files for software that will not open the newer format.",
    howTo: [
      "Upload the WebP image.",
      "It is decoded and re-encoded as JPG.",
      "Download the JPG."
    ],
    useCases: "Images saved from websites often arrive as WebP, which older photo editors, print services, and some office software refuse to open.",
    faqs: [
      { q: "Will the file get bigger?", a: "Usually yes. JPG is less efficient than WebP, so the same image typically takes more space as a JPG." },
      { q: "What happens to transparency?", a: "JPG cannot store transparency, so transparent areas become white. Convert to PNG instead if you need to keep them." },
      { q: "Is the conversion private?", a: "Yes. It runs in your browser and the image is never sent anywhere." }
    ]
  },
  "webp to png": {
    title: "Convert WebP to PNG",
    description: "Convert WebP images to PNG while keeping transparency intact.",
    howTo: [
      "Upload the WebP image.",
      "It is decoded and saved as PNG.",
      "Download the PNG."
    ],
    useCases: "The right choice when the image has a transparent background — logos, icons, and cut-outs that need to sit over other content without a white box around them.",
    faqs: [
      { q: "PNG or JPG for a WebP file?", a: "PNG when the image has transparency or sharp edges like text and logos. JPG when it is a photograph and file size matters more." },
      { q: "Why is the PNG so much larger?", a: "PNG uses lossless compression, so it stores every pixel exactly. That fidelity is the trade-off for the larger size." },
      { q: "Is transparency preserved?", a: "Yes. Transparent areas in the WebP stay transparent in the PNG." }
    ]
  },
  "resize image": {
    title: "Resize Image Dimensions",
    description: "Change an image's width and height to the exact pixel size a platform or form requires.",
    howTo: [
      "Upload the image you need resized.",
      "Enter your target width and height.",
      "Download the resized image."
    ],
    useCases: "Application forms that demand a photo of exact pixel dimensions, social platforms with fixed banner sizes, and website images that load slowly because they are far larger than the space they occupy.",
    faqs: [
      { q: "Will the image look stretched?", a: "It will if you set a width and height that do not match the original proportions. Keeping the aspect ratio avoids distortion." },
      { q: "Can I enlarge a small image?", a: "You can, but enlarging invents pixels that were never captured, so the result looks soft. Starting from the largest original you have always gives a better outcome." },
      { q: "Does resizing reduce the file size?", a: "Yes, substantially — halving both dimensions removes about three quarters of the pixels. Use Compress Image if you need to keep the dimensions but shrink the file." }
    ]
  },
  "compress image": {
    title: "Compress Image File Size",
    description: "Reduce an image's file size while keeping the dimensions, with a quality slider you control.",
    howTo: [
      "Upload the image you want to make smaller.",
      "Set the quality level — around 80 is a good balance for most photos.",
      "Download the compressed image and compare the before and after sizes."
    ],
    useCases: "Getting a photo under an upload limit, speeding up a page carrying dozens of product images, or reducing an email attachment without changing how the picture looks.",
    faqs: [
      { q: "What quality setting should I use?", a: "Around 80 is where most photos lose almost nothing visible while dropping a large share of the file size. Below 50 compression artefacts start showing on detailed images." },
      { q: "Are the dimensions changed?", a: "No. Compression only affects how the pixels are stored. Use Resize Image if you need different dimensions." },
      { q: "Can I recover the original quality later?", a: "No — compression is lossy and discarded detail is gone. Keep your originals." }
    ]
  },
  "crop image": {
    title: "Crop Image Online",
    description: "Cut an image down to the part you want, removing unwanted edges and reframing the subject.",
    howTo: [
      "Upload the image you want to crop.",
      "Select the area to keep.",
      "Download the cropped image."
    ],
    useCases: "Squaring off a photo for a profile picture, cutting a distracting background out of a product shot, or reframing a screenshot down to the section that matters.",
    faqs: [
      { q: "Does cropping reduce quality?", a: "No. Cropping keeps the original pixels of the area you selected — it removes pixels rather than degrading them." },
      { q: "Can I crop to an exact ratio?", a: "Set the crop area to the proportions you need. For a specific pixel size, crop first and then use Resize Image." },
      { q: "Where is the image processed?", a: "In your browser. Nothing is uploaded to a server." }
    ]
  },
  "add text": {
    title: "Add Text to Image",
    description: "Place custom text over an image and download the result, with no design software needed.",
    howTo: [
      "Upload the image you want to caption.",
      "Enter your text and position it on the image.",
      "Download the finished image."
    ],
    useCases: "Quick social graphics, labelling a screenshot before sending it to a colleague, adding a caption to a photo, or marking an image with a note for a client.",
    faqs: [
      { q: "Can I change the font and colour?", a: "Yes, the text appearance is adjustable so it stays legible over whatever is underneath it." },
      { q: "Can the text be edited after downloading?", a: "No. It is rendered into the image pixels. Keep the original if you expect to revise the wording." },
      { q: "What format is the output?", a: "PNG, which keeps text edges sharp. JPG compression tends to blur fine lettering." }
    ]
  },
  "csv to json": {
    title: "Convert CSV to JSON",
    description: "Turn a CSV spreadsheet export into structured JSON, ready for an API, a config file, or a JavaScript application.",
    howTo: [
      "Upload your .csv file.",
      "The header row becomes the object keys and each data row becomes an object.",
      "Download the JSON."
    ],
    useCases: "Feeding spreadsheet data into an application, seeding a database from an export, or preparing a product list for an API that only accepts JSON.",
    faqs: [
      { q: "What happens to my header row?", a: "It becomes the keys of each JSON object, so a column named 'price' turns into a 'price' property on every record." },
      { q: "Are numbers converted to numeric types?", a: "Values come through as they appear in the file. Check your types before feeding the output into something strict about them." },
      { q: "What about commas inside a field?", a: "Properly quoted fields are handled correctly. A CSV that uses semicolons or tabs as separators needs converting to comma-separated first." }
    ]
  },
  "json to csv": {
    title: "Convert JSON to CSV",
    description: "Flatten a JSON array into a CSV file you can open in Excel, Google Sheets, or Numbers.",
    howTo: [
      "Upload your .json file containing an array of objects.",
      "Object keys become the column headers.",
      "Download the CSV and open it in your spreadsheet application."
    ],
    useCases: "Making an API response readable for colleagues who work in spreadsheets, preparing exported data for analysis, or getting a JSON log into a format you can filter and pivot.",
    faqs: [
      { q: "What JSON structure does it expect?", a: "An array of objects with consistent keys. A deeply nested structure needs flattening first, since CSV has no way to express nesting." },
      { q: "What happens to nested objects?", a: "CSV is a flat format, so nested values cannot be represented as separate columns. Flatten your structure before converting if the nested data matters." },
      { q: "Will Excel open it correctly?", a: "Yes, though Excel sometimes reformats values that look like dates. Import as text if you need the raw values preserved exactly." }
    ]
  },
  "excel to pdf": {
    title: "Convert Excel to PDF",
    description: "Turn an XLS or XLSX spreadsheet into a PDF that everyone can open and nobody can accidentally edit.",
    howTo: [
      "Upload your .xls or .xlsx file.",
      "The sheet is rendered and paginated.",
      "Download the PDF."
    ],
    useCases: "Sending an invoice or budget where the figures must not change in transit, sharing a report with people who do not have Excel, and attaching financial statements to a formal submission.",
    faqs: [
      { q: "How do wide sheets fit on a page?", a: "Very wide sheets get split across pages. Setting a print area and page breaks in Excel before converting gives you control over where those splits fall." },
      { q: "Are formulas preserved?", a: "No — the PDF shows calculated values, not the formulas behind them. That is usually the point of sending a PDF." },
      { q: "Do all worksheets get included?", a: "Check the output against your workbook if it has several sheets, particularly when some are hidden." }
    ]
  },
  "xml to json": {
    title: "Convert XML to JSON",
    description: "Transform XML into JSON so it can be used with modern APIs and JavaScript tooling.",
    howTo: [
      "Upload your .xml file.",
      "Elements and attributes are mapped into a JSON structure.",
      "Download the JSON."
    ],
    useCases: "Modernising an integration with a legacy system that still emits XML, working with an RSS or sitemap file programmatically, or converting a configuration file into a format your stack handles natively.",
    faqs: [
      { q: "How are XML attributes represented?", a: "Attributes and child elements both become properties in the resulting JSON, since JSON has no separate concept of an attribute." },
      { q: "What if my XML is invalid?", a: "Conversion needs well-formed XML. Unclosed tags or mismatched nesting will stop it — validate the file first if it fails." },
      { q: "Are namespaces preserved?", a: "Namespace prefixes appear in the resulting property names. Check the output if your XML relies on them heavily." }
    ]
  },
  "paragraph writer": {
    title: "AI Paragraph Writer",
    description: "Generate a single well-structured paragraph on any topic — useful when you know what you want to say but the opening sentence will not come.",
    howTo: [
      "Type your topic or the point you want the paragraph to make.",
      "Click Generate with AI and wait a few seconds.",
      "Copy the result or download it as a text file, then edit it to sound like you."
    ],
    useCases: "Filling a gap in a longer document, drafting a product description, or getting past a blank page when you know the argument but not the phrasing.",
    faqs: [
      { q: "How long is the output?", a: "Roughly 90 to 150 words — one substantial paragraph rather than a full article." },
      { q: "Should I publish it as-is?", a: "Treat it as a draft. AI output reads generically and can state things with more confidence than the facts support. Edit it and check anything factual." },
      { q: "Is there a usage limit?", a: "The free tier allows 10 generations per 10 minutes so the service stays available to everyone." }
    ]
  },
  "essay writer": {
    title: "AI Essay Writer",
    description: "Produce a structured essay draft with an introduction, argued body paragraphs, and a conclusion.",
    howTo: [
      "Enter your essay topic or question.",
      "Click Generate with AI.",
      "Use the draft as a structural starting point and rewrite it in your own words."
    ],
    useCases: "Seeing how an argument might be organised before you write it yourself, generating a counter-argument to test your own position, or breaking through a blank page on an unfamiliar topic.",
    faqs: [
      { q: "Can I submit this as coursework?", a: "No. Submitting AI-generated text as your own work is academic misconduct at essentially every institution, and detection tools are widely deployed. Use it to understand structure, then write your own." },
      { q: "Are the facts reliable?", a: "Not necessarily. Language models produce fluent text that can contain confident errors, including invented citations. Verify every factual claim independently." },
      { q: "How long is the essay?", a: "Around 450 to 650 words — a solid draft rather than a finished long-form piece." }
    ]
  },
  "story generator": {
    title: "AI Story Generator",
    description: "Turn a premise into a short story with a character, a complication, and an ending.",
    howTo: [
      "Describe your premise — a character, a setting, a situation, or all three.",
      "Click Generate with AI.",
      "Read the result and take what is useful for your own writing."
    ],
    useCases: "Warming up when you cannot start, generating a scenario for a game session, producing a bedtime story from a child's suggestion, or seeing an unexpected direction for a premise you have been stuck on.",
    faqs: [
      { q: "How long is the story?", a: "Roughly 400 to 600 words — a complete short piece rather than a chapter." },
      { q: "Can I publish or sell the output?", a: "AI-generated text has an unsettled copyright status in many countries and some platforms require disclosure. Check the rules where you intend to publish." },
      { q: "Why do the stories feel similar?", a: "A vague premise produces a generic story. Specific details — an unusual setting, a particular constraint, a character with a strange want — produce far more interesting results." }
    ]
  },
  "content improver": {
    title: "AI Content Improver",
    description: "Rewrite your own text to be clearer and tighter, keeping your meaning and voice intact.",
    howTo: [
      "Paste the text you want improved.",
      "Click Generate with AI.",
      "Compare the rewrite against your original and keep what genuinely reads better."
    ],
    useCases: "Tightening a first draft, fixing awkward phrasing in a piece written in a second language, or cutting a paragraph that has grown bloated without losing the point.",
    faqs: [
      { q: "Will it change what I meant?", a: "It is instructed to preserve your meaning, facts, and voice — but read the result. Compression can occasionally drop a qualifier that mattered." },
      { q: "Does it add new information?", a: "It should not. If the rewrite introduces a claim you did not make, remove it — do not assume it is correct." },
      { q: "How much text can I paste?", a: "Up to 4000 characters at a time. Work through longer pieces in sections." }
    ]
  },
  "blog post idea": {
    title: "AI Blog Post Idea Generator",
    description: "Get eight specific blog post concepts from a topic or niche, each with an angle and an intended reader.",
    howTo: [
      "Enter your topic, niche, or audience.",
      "Click Generate with AI.",
      "Pick the ideas that fit your audience and discard the rest."
    ],
    useCases: "Filling out a content calendar, breaking a repetitive publishing pattern, or finding angles on a subject you have already written about several times.",
    faqs: [
      { q: "How many ideas do I get?", a: "Eight, each with a working title, the angle, and who it serves." },
      { q: "Will the ideas be original?", a: "They are combinations of common patterns, so treat them as prompts rather than finished concepts. The specific detail you add is what makes a post worth reading." },
      { q: "How do I get better ideas?", a: "Be specific about your audience. 'Fitness' returns generic results; 'strength training for people over 50 with joint pain' returns ideas you can actually use." }
    ]
  },
  "instagram caption": {
    title: "AI Instagram Caption Generator",
    description: "Generate five caption options in different tones from a description of your post, each with relevant hashtags.",
    howTo: [
      "Describe your photo or video and what you want to convey.",
      "Click Generate with AI.",
      "Pick the option that fits and adjust it to sound like your account."
    ],
    useCases: "Getting past caption block, finding a different angle on a routine post, or producing several options quickly when you are scheduling a batch of content.",
    faqs: [
      { q: "How many options do I get?", a: "Five, deliberately varied — short and punchy, story-led, question-led, value-led, and playful — plus hashtags for each." },
      { q: "Are the hashtags any good?", a: "They are topically relevant, not researched for reach. Check current volume and competition in a hashtag tool before relying on them." },
      { q: "Should I post the caption unedited?", a: "Adjust it first. Accounts that sound generic get less engagement, and your own voice is the thing an AI cannot supply." }
    ]
  },
  "linkedin post": {
    title: "AI LinkedIn Post Generator",
    description: "Draft a LinkedIn post with a hook, a concrete body, and a closing line that invites replies.",
    howTo: [
      "Enter your topic, insight, or the story you want to tell.",
      "Click Generate with AI.",
      "Edit in your specifics — real numbers and real experience are what make the post land."
    ],
    useCases: "Turning a piece of work into a post, sharing a lesson from a project, or announcing something without sounding like a press release.",
    faqs: [
      { q: "How long is the post?", a: "Between 120 and 220 words, which sits well within LinkedIn's display limit before the 'see more' cut." },
      { q: "Will it sound like AI?", a: "It might, if you post it unedited. Replacing the generic examples with your own specifics is what fixes that — and it is the part readers actually respond to." },
      { q: "Does it add hashtags?", a: "At most three. Hashtag stuffing reads as spam on LinkedIn and does not help reach." }
    ]
  },
};