/**
 * Rehber icerikleri - statik TypeScript.
 *
 * Neden burada: proje zaten arac basina ozgun metni client/src/data/toolSEO.ts
 * icinde statik olarak tutuyor. Ayni kalip izlendi; CMS veya veritabani
 * eklenmedi, yeni bagimlilik yok.
 *
 * Icerik kurallari:
 *   - Her cumle bu sitedeki gercek davranisa dayanir. Uydurma istatistik,
 *     "internetin en iyisi" tarzi iddia veya mutlak gizlilik vaadi yok.
 *   - Sinirlar aciklanir: dosya boyutu tavanlari, sunucu/tarayici ayrimi,
 *     bir aracin yapamayacagi seyler.
 *   - Arac baglantilari `relatedTools` icinde tutulur. Arac sayfalarindaki
 *     "Helpful Guides" bolumu bu listeden TERS INDEKS ile uretilir, yani
 *     ikinci bir eslesme tablosu yoktur ve listeler birbirinden kaymaz.
 */

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "list"; items: string[] }
  | { type: "note"; title: string; text: string };

export interface GuideToolLink {
  href: string;
  label: string;
}

export interface Guide {
  slug: string;
  /** Sayfadaki tek H1. */
  title: string;
  /** <title> etiketi - H1'den farkli olabilir. */
  metaTitle: string;
  metaDescription: string;
  /** Liste kartinda ve makale girisinde kullanilir. */
  summary: string;
  /** ISO tarih; sitemap lastmod ve "Updated" satiri icin. */
  updated: string;
  category: "PDF" | "Images" | "Video" | "How it works";
  relatedTools: GuideToolLink[];
  /** Diger rehberlerin slug'lari. */
  relatedGuides: string[];
  blocks: GuideBlock[];
  faqs?: { q: string; a: string }[];
}

export const GUIDES: Guide[] = [
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files Online",
    metaTitle: "How to Merge PDF Files Online - ProToolHub Guide",
    metaDescription:
      "Combine several PDFs into one file, get the page order right the first time, and know the size limits before you upload.",
    summary:
      "Combining PDFs is easy. Getting the pages in the order you meant is where people lose time. Here is how to do both.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/merge-pdf", label: "Merge PDF" },
      { href: "/tools/reorder-pages", label: "Reorder Pages" },
      { href: "/tools/compress-pdf", label: "Compress PDF" },
    ],
    relatedGuides: ["how-to-reorder-pdf-pages", "how-to-compress-a-pdf", "how-to-split-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "Merging PDFs comes up more often than it should: a scanned contract that arrived as three separate emails, a report where the charts were exported separately from the text, an application form that wants everything as one attachment. The mechanics take seconds. The part that actually costs people time is discovering afterwards that page 14 ended up between pages 3 and 4.",
      },
      { type: "h2", text: "What merging actually does" },
      {
        type: "p",
        text: "A merge copies the pages out of each source document, in the order you give them, into a new PDF. Text stays text, so it remains selectable and searchable. Images keep whatever resolution they had. Nothing is re-compressed, which is why a merge of a 4 MB file and a 6 MB file produces roughly a 10 MB file rather than something smaller.",
      },
      {
        type: "p",
        text: "What does not survive a merge is anything that belongs to the document rather than to a page: bookmarks, form field values, and digital signatures. A signature is a statement about one specific file, so the moment that file is rebuilt into a new one, the signature no longer applies. If you need signed documents to stay verifiable, keep them separate and attach them individually.",
      },
      { type: "h2", text: "Merging step by step" },
      {
        type: "steps",
        items: [
          "Open Merge PDF and select every file you want to combine. You can pick them all at once, or drop them onto the page together.",
          "Check the order before you run it. The tool combines files in the order you provided them, so the second file's pages follow the first file's last page.",
          "Run the merge and download the result.",
          "Open the output and skim the page transitions — the joins between documents are the only places anything can be wrong.",
        ],
      },
      { type: "h2", text: "Getting the order right" },
      {
        type: "p",
        text: "The most reliable trick has nothing to do with the tool: rename your files so they sort correctly before you select them. Prefix them with numbers and pad the numbers — 01-cover.pdf, 02-report.pdf, 03-appendix.pdf. Without the leading zero, most systems sort 10 before 2, which is exactly the kind of thing you notice only after sending the file.",
      },
      {
        type: "p",
        text: "If the merged document is right except for a handful of pages in the wrong place, you do not need to start over. Run the result through Reorder Pages and move them.",
      },
      { type: "h2", text: "Limits worth knowing before you start" },
      {
        type: "list",
        items: [
          "Each file can be up to 20 MB, and you can merge up to 20 files in one go.",
          "The merge runs on our server, so your files are uploaded over an encrypted connection, combined in memory, and returned. Nothing in our code saves them afterwards.",
          "Processing has a 55-second ceiling. Twenty large scanned documents can approach it; if that happens, merge in two batches and then merge the two results.",
          "Password-protected PDFs will not merge until the password is removed, because the pages cannot be read while the file is encrypted.",
        ],
      },
      {
        type: "note",
        title: "If the result is too big to email",
        text: "Merging does not shrink anything, so a combined file is the sum of its parts. Most mail servers reject attachments over about 10 MB. Run the merged file through Compress PDF afterwards — if it is mostly scans or photos, that usually helps a lot. If it is mostly text, it will barely move, and the honest answer is to send a link instead.",
      },
    ],
    faqs: [
      {
        q: "Will merging reduce the quality of my pages?",
        a: "No. Pages are copied as they are, with no re-compression, so text stays sharp and images keep their original resolution.",
      },
      {
        q: "Can I merge a Word document with a PDF?",
        a: "Not directly. Convert the Word file to PDF first with Word to PDF, then merge the two PDFs.",
      },
      {
        q: "Why did my form fields stop working after merging?",
        a: "Form data belongs to the document rather than to individual pages, so it does not carry across when the pages are copied into a new file. Fill the form in and export a flattened copy before merging.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-split-a-pdf",
    title: "How to Split a PDF Into Separate Pages",
    metaTitle: "How to Split a PDF Into Separate Pages - ProToolHub Guide",
    metaDescription:
      "Break a PDF into individual pages, understand what you get back as a ZIP, and know when removing pages is the better tool.",
    summary:
      "Splitting gives you one file per page in a ZIP. That is the right answer less often than people expect — here is when it is, and what to use otherwise.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/split-pdf", label: "Split PDF" },
      { href: "/tools/delete-pages", label: "Remove Pages" },
      { href: "/tools/merge-pdf", label: "Merge PDF" },
    ],
    relatedGuides: ["how-to-remove-pages-from-a-pdf", "how-to-merge-pdf-files", "convert-pdf-pages-to-jpg"],
    blocks: [
      {
        type: "p",
        text: "\"Split this PDF\" usually means one of three different things, and picking the wrong one wastes a few minutes. Sometimes you want every page as its own file. Sometimes you want to keep a few pages and throw the rest away. Sometimes you want one page as an image to drop into a slide. Only the first of those is really a split.",
      },
      { type: "h2", text: "What our Split PDF tool gives you" },
      {
        type: "p",
        text: "Split PDF takes a document and produces one PDF per page. A 40-page report comes back as 40 files, named page_001.pdf through page_040.pdf, packaged together in a single ZIP so your browser only has to download one thing. Open the ZIP with your operating system's built-in extractor — no extra software needed on Windows, macOS or most Linux desktops.",
      },
      {
        type: "p",
        text: "Each page keeps its original content: text stays selectable, images keep their resolution, page dimensions are unchanged. If you feed in a single-page PDF, you get that same PDF straight back rather than a ZIP containing one file, because wrapping one page in an archive helps nobody.",
      },
      { type: "h2", text: "When splitting is the wrong tool" },
      {
        type: "h3",
        text: "You want to keep most of the document",
      },
      {
        type: "p",
        text: "If a 30-page file has four pages you do not want, splitting gives you 30 files to sort through and merge back together. Use Remove Pages instead — you name the pages to drop and get one document back with everything else intact.",
      },
      { type: "h3", text: "You want a picture of a page" },
      {
        type: "p",
        text: "A split gives you PDFs, and plenty of places will not take a PDF — most social platforms, many web forms, most chat apps. If what you actually need is an image, use PDF to JPG, which renders each page as a picture. That tool runs entirely in your browser.",
      },
      { type: "h3", text: "You want a specific range as one file" },
      {
        type: "p",
        text: "For something like \"just chapter three, pages 40 to 58, as a single document\", the shortest path is to remove the pages either side of the range with Remove Pages. Splitting and re-merging 19 pages is a lot of clicking for the same outcome.",
      },
      { type: "h2", text: "Practical notes" },
      {
        type: "list",
        items: [
          "Uploads are capped at 20 MB and processing at 55 seconds. A long scanned document can hit either limit.",
          "Splitting happens on our server: the file is uploaded over an encrypted connection, processed in memory, and returned as a ZIP. Nothing in our code stores it afterwards.",
          "A password-protected PDF cannot be split while it is encrypted.",
          "The ZIP contains PDFs, not images. If your recipient asked for images, you want PDF to JPG.",
        ],
      },
      {
        type: "note",
        title: "Check the page count first",
        text: "Splitting a 400-page document produces 400 files. That is occasionally what you want and usually not. Open the file and look at the page count before you run it — it takes two seconds and saves cleaning up a very full Downloads folder.",
      },
    ],
    faqs: [
      {
        q: "Can I split out just one page?",
        a: "Split the document and take the page you want out of the ZIP. If you would rather have a single-page file directly, use Remove Pages and delete everything except the page you are keeping.",
      },
      {
        q: "Are the split files smaller than the original?",
        a: "Each file is smaller because it holds one page, but the total is usually a little larger than the original — every PDF carries its own structural overhead, and now you have many of them.",
      },
      {
        q: "Can I open the ZIP on a phone?",
        a: "Recent iOS and Android versions can open ZIP files from the Files app without extra software. Older devices may need a file manager app.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-compress-a-pdf",
    title: "How to Compress a PDF Without Wrecking It",
    metaTitle: "How to Compress a PDF Without Losing Quality - ProToolHub Guide",
    metaDescription:
      "Why some PDFs shrink by ninety percent and others barely move, what compression actually changes, and what to do when it does not help.",
    summary:
      "Two PDFs of the same size can behave completely differently under compression. The difference is what is inside them, and it decides whether this tool can help you at all.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/compress-pdf", label: "Compress PDF" },
      { href: "/tools/compress-image", label: "Compress Image" },
      { href: "/tools/split-pdf", label: "Split PDF" },
    ],
    relatedGuides: ["how-to-merge-pdf-files", "pdf-vs-jpg-which-format", "how-browser-based-file-processing-works"],
    blocks: [
      {
        type: "p",
        text: "You have a PDF that will not send. The mail server wants it under 10 MB, the upload form caps at 5 MB, and yours is 24 MB. Before you try anything, it is worth knowing which kind of PDF you have, because that single fact predicts whether compression will rescue you or waste your time.",
      },
      { type: "h2", text: "Where the megabytes actually are" },
      {
        type: "p",
        text: "A page of text is astonishingly small. Text in a PDF is stored as characters plus a reference to a font, so a hundred pages of prose might come to a few hundred kilobytes. If your file is enormous, the size is almost never the text — it is images.",
      },
      {
        type: "p",
        text: "The usual culprits are scans and photos. A document scanner set to 600 DPI produces roughly four times the data of 300 DPI for a page that will be read on a screen either way. A phone photograph of a receipt is a 12-megapixel image dropped onto a page the size of a postcard. In both cases the file is carrying far more image detail than anyone will ever see.",
      },
      { type: "h2", text: "What our compression does" },
      {
        type: "p",
        text: "Compress PDF looks inside the document for embedded JPEG images and re-encodes them at a lower quality setting. Any image whose longest edge is over 2000 pixels is also scaled down to that limit, because beyond it you are storing detail that no screen and few printers will reproduce at typical page sizes.",
      },
      {
        type: "p",
        text: "The text is not touched at all. It stays selectable, searchable and exactly as sharp as it was. Page count, page dimensions and layout are unchanged. What you lose is some fidelity in photographs and scans — usually invisible on screen, occasionally noticeable if you zoom right in on fine print in a scan.",
      },
      {
        type: "note",
        title: "If it cannot shrink your file, it says so",
        text: "When re-encoding does not produce a meaningfully smaller document, the tool returns your original file unchanged and tells you plainly that there was nothing worth compressing. It will not hand you a file that is the same size, or larger, and call that a success. A text-heavy PDF is the usual case: it is already efficient, and there is nothing to squeeze.",
      },
      { type: "h2", text: "What to do when compression does not help" },
      {
        type: "steps",
        items: [
          "Check whether you need the whole document. Removing the appendix with Remove Pages, or sending one chapter, often beats any amount of compression.",
          "If it is a scan, consider whether it needed to be a scan. A document exported straight to PDF from Word is a fraction of the size of the same document printed and scanned.",
          "Split a long report and send it in parts, if the recipient can work with that.",
          "For anything genuinely large, share a link rather than an attachment. Email was not built for this and no compression setting changes that.",
        ],
      },
      { type: "h2", text: "A note on scanner settings" },
      {
        type: "p",
        text: "The cheapest compression is the one you do before the file exists. If you control the scanner, 300 DPI is enough for a document that will be read on a screen or printed at normal size, and scanning in greyscale rather than colour roughly thirds the data for text documents. Getting this right at the source beats compressing afterwards every time, because no amount of re-encoding recovers what a lower-quality scan would never have created.",
      },
    ],
    faqs: [
      {
        q: "Why did my file barely get smaller?",
        a: "Almost certainly because it is mostly text. Text is already compact in a PDF, so there is nothing substantial to reduce. The tool will tell you when this is the case rather than pretending otherwise.",
      },
      {
        q: "Will the text get blurry?",
        a: "No. Only embedded images are re-encoded. Real text in the PDF is left alone. If your whole page is a scanned picture of text, then that picture is an image and will be affected.",
      },
      {
        q: "Can I choose the compression level?",
        a: "Not at the moment — the tool uses one setting chosen to be safe for reading on screen. If you need finer control over a specific photograph, compress the image first with Compress Image, which has a quality slider, then build the PDF from it.",
      },
      {
        q: "Is the compressed file still a normal PDF?",
        a: "Yes. It opens in any PDF reader, keeps the same pages and layout, and the text remains selectable and searchable.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "convert-pdf-pages-to-jpg",
    title: "How to Convert PDF Pages to JPG Images",
    metaTitle: "How to Convert PDF Pages to JPG Images - ProToolHub Guide",
    metaDescription:
      "Turn PDF pages into images for slides, social posts and forms that reject PDFs — and understand what you give up in the process.",
    summary:
      "Plenty of places will not accept a PDF. Converting pages to images fixes that, at the cost of everything that made it a PDF.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/pdf-to-jpg", label: "PDF to JPG" },
      { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
      { href: "/tools/compress-image", label: "Compress Image" },
    ],
    relatedGuides: ["pdf-vs-jpg-which-format", "how-browser-based-file-processing-works", "how-to-split-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "There is a whole category of frustration that comes from software refusing PDFs. Instagram will not take one. Most web forms that ask for a photo will not either. Slide decks technically can embed one but rarely place it where you wanted. In all of those cases the fix is the same: turn the page into a picture.",
      },
      { type: "h2", text: "What you get" },
      {
        type: "p",
        text: "PDF to JPG renders every page of your document as a separate JPG image. A one-page PDF gives you a single .jpg file. Anything longer gives you a ZIP containing one image per page, named page_01.jpg upward so they stay in order.",
      },
      {
        type: "p",
        text: "Pages are rendered at roughly two and a half times their nominal size, which is enough to stay crisp on a high-resolution display, with a ceiling of about 4000 pixels on the longest edge so that very large pages do not exceed what browsers will render.",
      },
      { type: "h2", text: "This one runs on your device" },
      {
        type: "p",
        text: "Unlike most of our PDF tools, this conversion happens entirely inside your browser. The PDF is opened and drawn page by page on your own machine, and the images are assembled there too. Your document is never uploaded to us. If you are working with something confidential, that difference is worth knowing about — and it is explained more fully in our guide to browser-based processing.",
      },
      {
        type: "p",
        text: "The practical consequence is that speed depends on your computer rather than our server, and a very long document will take a noticeable moment. Leave the tab open while it works.",
      },
      { type: "h2", text: "What you lose by converting" },
      {
        type: "list",
        items: [
          "Selectable text. An image of a sentence is not a sentence any more — nobody can copy from it, and search engines and screen readers cannot read it.",
          "Vector sharpness. Charts and line art in a PDF are drawn at whatever size you view them. Once rendered to JPG they are fixed pixels and will soften if enlarged.",
          "File size, usually. A text-heavy page is far smaller as a PDF than as an image of that page.",
          "Links, bookmarks and form fields, all of which are document features rather than picture content.",
        ],
      },
      {
        type: "note",
        title: "JPG or PNG for this?",
        text: "JPG suits pages that are mostly photographic. For a page of text or a chart with hard edges and flat colour, PNG is the better format — JPG compression leaves faint smudging around sharp black-on-white edges. Our conversion produces JPG; if you specifically need PNG for a page of line art, convert to JPG and then use WebP to PNG, or take the screenshot route for a single page.",
      },
      { type: "h2", text: "Going the other way" },
      {
        type: "p",
        text: "If you have images and need a PDF — photos of receipts for an expense claim, scanned pages from a phone — JPG to PDF does the reverse and puts each image on its own page. That conversion also runs in your browser.",
      },
    ],
    faqs: [
      {
        q: "Why did I get a ZIP instead of an image?",
        a: "Because your PDF has more than one page. Each page becomes its own JPG, and they are bundled into one ZIP so you only download a single file. Single-page PDFs come back as a plain .jpg.",
      },
      {
        q: "Can I convert just one page of a long document?",
        a: "Not directly. Use Remove Pages to keep only the page you want, then convert the result.",
      },
      {
        q: "The images look soft when I print them. Why?",
        a: "Screen resolution and print resolution are different problems. Pages are rendered for on-screen use; enlarging them for print will show it. If you need to print, print the PDF itself rather than an image of it.",
      },
      {
        q: "Is my PDF uploaded anywhere?",
        a: "No. This tool runs entirely in your browser, so the file stays on your device.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-remove-pages-from-a-pdf",
    title: "How to Remove Pages From a PDF",
    metaTitle: "How to Remove Pages From a PDF - ProToolHub Guide",
    metaDescription:
      "Delete unwanted pages from a PDF, count page numbers correctly, and understand why removing a page is not the same as redacting it.",
    summary:
      "Dropping pages is simple. Counting them correctly is where mistakes happen — and there is one important thing removal does not do.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/delete-pages", label: "Remove Pages" },
      { href: "/tools/reorder-pages", label: "Reorder Pages" },
      { href: "/tools/split-pdf", label: "Split PDF" },
    ],
    relatedGuides: ["how-to-reorder-pdf-pages", "how-to-split-a-pdf", "how-to-compress-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "Blank pages from a duplex scan, a cover sheet nobody needs, the fax confirmation that came through with the contract, an internal appendix that should not go to the client. Removing pages is one of the most ordinary things you can do to a PDF, and almost all of the difficulty is in specifying which pages you mean.",
      },
      { type: "h2", text: "Removing pages" },
      {
        type: "steps",
        items: [
          "Open Remove Pages and upload your document.",
          "Enter the page numbers you want to delete, separated by commas — for example 1, 7, 12.",
          "Run it and download the result. Everything you did not list stays exactly as it was.",
        ],
      },
      { type: "h2", text: "Counting pages correctly" },
      {
        type: "p",
        text: "Page numbers here mean position in the file, counted from 1, not whatever is printed on the page. This trips people up constantly with documents that have a cover and a table of contents before the numbering starts. If the page printed as \"1\" is the fourth sheet in the file, then that is page 4 as far as the tool is concerned.",
      },
      {
        type: "p",
        text: "The safe approach is to open the PDF in any reader and use the position counter it shows — the \"7 of 45\" indicator — rather than reading numbers off the page itself. Note the ones you want gone, then enter those.",
      },
      {
        type: "p",
        text: "One more thing worth knowing: the removal is worked out against the original document, so you do not need to mentally renumber as pages disappear. Listing 3, 4, 5 removes the third, fourth and fifth pages of the file you uploaded, not a shifting target.",
      },
      {
        type: "note",
        title: "Removing is not redacting",
        text: "This is the important one. Taking a page out of a document removes that page's content from the file. It does not scrub metadata elsewhere in the document, and it is not a substitute for proper redaction of sensitive text on pages you are keeping. If you are removing pages because they contain confidential information and the document is going somewhere it cannot be recalled from, treat that as a redaction task and verify the result rather than assuming.",
      },
      { type: "h2", text: "Related jobs" },
      {
        type: "list",
        items: [
          "Keeping only a range, like pages 40 to 58: remove everything before and after it. That is fewer steps than splitting and re-merging.",
          "Pages in the wrong order rather than unwanted: use Reorder Pages instead.",
          "Wanting every page as its own file: that is Split PDF.",
        ],
      },
      { type: "h2", text: "Limits" },
      {
        type: "p",
        text: "Uploads are capped at 20 MB and processing at 55 seconds. The file is processed on our server — uploaded over an encrypted connection, changed in memory, returned to you, and not saved afterwards. You cannot remove every page, because a PDF with no pages is not a valid document; the tool will refuse rather than hand you a broken file.",
      },
    ],
    faqs: [
      {
        q: "Can I remove a range like 5 to 12 without typing every number?",
        a: "List the numbers separated by commas. For a long stretch it is quicker to work out the pages you are keeping and check whether the job is really a split.",
      },
      {
        q: "Does the file get smaller?",
        a: "Usually, roughly in proportion to what you removed — unless the pages you dropped were plain text, in which case the difference will be slight. Text takes up very little room.",
      },
      {
        q: "I deleted the wrong page. Can I undo it?",
        a: "Not within the tool — it produces a new file and does not keep a copy of your original. Your original is still on your device, so start again from that.",
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-reorder-pdf-pages",
    title: "How to Reorder PDF Pages",
    metaTitle: "How to Reorder PDF Pages - ProToolHub Guide",
    metaDescription:
      "Put PDF pages back in the right order, write the page sequence correctly, and fix the classic reversed-scan problem.",
    summary:
      "Reordering asks you to describe the order you want, not the changes you want. That distinction is the whole trick.",
    updated: "2026-09-04",
    category: "PDF",
    relatedTools: [
      { href: "/tools/reorder-pages", label: "Reorder Pages" },
      { href: "/tools/delete-pages", label: "Remove Pages" },
      { href: "/tools/merge-pdf", label: "Merge PDF" },
    ],
    relatedGuides: ["how-to-remove-pages-from-a-pdf", "how-to-merge-pdf-files", "how-to-split-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "Pages end up in the wrong order for boringly mechanical reasons. A sheet-feed scanner run through a double-sided stack produces all the fronts and then all the backs. A merge picked the files up alphabetically rather than in document order. Somebody scanned a pile that was face-down. The document is complete; it is just wrong.",
      },
      { type: "h2", text: "Describe the destination, not the change" },
      {
        type: "p",
        text: "This is the part that confuses people. Reordering does not take instructions like \"move page 5 to the front\". You give it the complete sequence you want, using the original page numbers, and it rebuilds the document in that order.",
      },
      {
        type: "p",
        text: "So for a four-page document where the last page belongs first, you would write 4, 1, 2, 3 — read as \"give me the old page 4, then old page 1, then old 2, then old 3\". Every page you want in the result has to appear in the list. Anything you leave out will not be in the output, which means you can also use this to drop pages, though Remove Pages is clearer for that.",
      },
      { type: "h2", text: "The reversed stack" },
      {
        type: "p",
        text: "The most common case is a document scanned back to front, so a six-page file reads 6, 5, 4, 3, 2, 1. The sequence you want is simply the numbers counted backwards: 6, 5, 4, 3, 2, 1. It looks strange to type the same thing you are seeing, but remember the list describes where each page should come from, not where it is going.",
      },
      { type: "h2", text: "The interleaved duplex scan" },
      {
        type: "p",
        text: "A trickier one. Scanning a double-sided stack in two passes gives you all the odd pages first, then all the even ones. For a 6-page document you have fronts at positions 1, 2, 3 and backs at positions 4, 5, 6, and the reading order you want is 1, 4, 2, 5, 3, 6.",
      },
      {
        type: "p",
        text: "If the second pass ran through the stack in reverse — which is what happens when you flip the whole pile rather than each sheet — the backs arrive in the opposite order, and the sequence becomes 1, 6, 2, 5, 3, 4. Work out which case you have by checking whether the last scanned page is the back of the first sheet or the back of the last one.",
      },
      {
        type: "note",
        title: "Check before you commit",
        text: "Write the sequence down before you type it, then count that it has as many entries as the document has pages. A missing number is a missing page, and the tool has no way to know you did not mean it.",
      },
      { type: "h2", text: "When reordering is not the answer" },
      {
        type: "list",
        items: [
          "If the trouble came from merging files in the wrong order, it is usually less work to rename the source files so they sort correctly and merge again.",
          "If you only need to drop pages rather than move them, Remove Pages is the direct tool.",
          "If you want each page separately anyway, split the document and reassemble the pieces you need.",
        ],
      },
      {
        type: "p",
        text: "The tool runs on our server: your file is uploaded over an encrypted connection, rebuilt in memory and returned, with a 20 MB upload limit and a 55-second processing ceiling. Page content is copied unchanged — reordering does not re-compress anything.",
      },
    ],
    faqs: [
      {
        q: "Can I move one page without listing all of them?",
        a: "No. The tool takes the full sequence you want. For a long document, the fastest approach is to write out the ranges either side of the page you are moving.",
      },
      {
        q: "What happens if I list a page twice?",
        a: "It appears twice in the result. That is occasionally useful — repeating a cover sheet, for example — but it is usually a typo, so check your list length against the page count.",
      },
      {
        q: "Does reordering affect quality?",
        a: "No. Pages are copied as they are, with no re-compression.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "resize-video-for-social-media",
    title: "How to Resize a Video for Social Media",
    metaTitle: "How to Resize a Video for Social Media - ProToolHub Guide",
    metaDescription:
      "Pick the right dimensions for feed posts, reels and shorts, understand padding versus cropping, and know why we will not upscale your clip.",
    summary:
      "Platforms crop or letterbox anything that arrives in the wrong shape. Deciding the shape yourself is the whole point of resizing.",
    updated: "2026-09-04",
    category: "Video",
    relatedTools: [
      { href: "/tools/video-resizer", label: "Video Resizer" },
      { href: "/tools/compress-video", label: "Compress Video" },
      { href: "/tools/trim-video", label: "Trim Video" },
    ],
    relatedGuides: ["how-browser-based-file-processing-works", "jpg-png-webp-which-format"],
    blocks: [
      {
        type: "p",
        text: "Every social platform reshapes what you give it. Upload a widescreen clip to a vertical feed and something has to happen — it gets letterboxed into a small strip, or cropped so the sides are cut off, and neither decision is yours. Resizing before you upload is how you take that decision back.",
      },
      { type: "h2", text: "Two different jobs" },
      {
        type: "h3", text: "Making the file smaller in dimensions",
      },
      {
        type: "p",
        text: "A modern phone records at 4K. Almost nothing needs 4K. Scaling a clip down to 1080p or 720p keeps the same shape and cuts the file size substantially, which matters when a messaging app caps uploads at a few tens of megabytes. On a phone screen the difference between 4K and 720p is close to invisible.",
      },
      { type: "h3", text: "Changing the shape" },
      {
        type: "p",
        text: "This is the social-specific job. A square 1:1 frame suits feed posts; a vertical 9:16 frame is what reels and shorts expect. Our presets for these fit your whole video inside the target frame and pad the empty space with black rather than cropping. Nothing is cut off — you keep the entire picture, with bars where the shape does not match.",
      },
      {
        type: "p",
        text: "That is a deliberate choice, and it is not always what you want. If your subject is centred and you would rather fill the frame edge to edge, cropping is the better treatment, and a video editor gives you control over which part of the frame survives. Padding is the safe default because it never silently removes anything.",
      },
      { type: "h2", text: "Why picking 1080p will not enlarge a 480p clip" },
      {
        type: "p",
        text: "The height presets never upscale. Choose 1080p for a 480p video and it stays at 480p. This is intentional: enlarging a video invents pixels that were never recorded, so the result is a bigger file that looks no better and often slightly worse. If your source is low resolution, no tool fixes that, and one that claimed to would only be making the file heavier.",
      },
      { type: "h2", text: "Where the work happens" },
      {
        type: "p",
        text: "Video processing runs entirely in your browser, using FFmpeg compiled to WebAssembly. Your video is never uploaded to our server. The trade-off is that the encoding engine is about 25 MB and downloads the first time you use a video tool in a session, and the encoding itself uses your own processor — so a long or high-resolution clip takes real time, and phones will struggle where a laptop will not. The result card shows the before and after dimensions so you can confirm the change actually happened.",
      },
      {
        type: "note",
        title: "Resize, then compress",
        text: "If your goal is a smaller file rather than a particular shape, resizing to 720p usually does more than any compression setting, because you are removing pixels rather than describing the same pixels more cheaply. Do that first, and reach for Compress Video only if you are still over the limit.",
      },
      { type: "h2", text: "Practical order of operations" },
      {
        type: "steps",
        items: [
          "Trim first. There is no sense encoding footage you are going to cut.",
          "Resize to the shape and height the destination expects.",
          "Compress only if the file is still too large.",
          "Play the result before uploading — check the framing is what you expected, especially with the 1:1 and 9:16 presets.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will the black bars show in my post?",
        a: "Yes — padding is part of the video. If you would rather fill the frame, you need to crop, which means deciding what to cut and is better done in an editor.",
      },
      {
        q: "What format do I get back?",
        a: "MP4 with H.264 video, which every social platform accepts. The original audio track is carried across unchanged.",
      },
      {
        q: "Why is it slow?",
        a: "Because the encoding is running on your machine rather than on a server. That is also why your video never leaves your device. A long clip on a phone may be impractical; use a desktop for anything substantial.",
      },
      {
        q: "Does the quality drop?",
        a: "Re-encoding is lossy, so some quality is lost. Starting from the best source you have keeps that to a minimum, and at normal viewing sizes it is not usually noticeable.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "jpg-png-webp-which-format",
    title: "JPG, PNG or WebP: Choosing an Image Format",
    metaTitle: "JPG vs PNG vs WebP - Which Image Format to Use - ProToolHub Guide",
    metaDescription:
      "A practical comparison of JPG, PNG and WebP, with the specific cases where each one wins and where converting will disappoint you.",
    summary:
      "Three formats, three genuinely different jobs. Most bad image decisions come from using a photographic format for graphics, or the reverse.",
    updated: "2026-09-04",
    category: "Images",
    relatedTools: [
      { href: "/tools/image-to-webp", label: "Image to WebP" },
      { href: "/tools/webp-to-jpg", label: "WebP to JPG" },
      { href: "/tools/webp-to-png", label: "WebP to PNG" },
      { href: "/tools/compress-image", label: "Compress Image" },
    ],
    relatedGuides: ["pdf-vs-jpg-which-format", "how-browser-based-file-processing-works", "convert-pdf-pages-to-jpg"],
    blocks: [
      {
        type: "p",
        text: "The difference between these formats is not quality in the abstract. It is what kind of picture each one was designed to store, and choosing badly costs you either file size or visible damage.",
      },
      { type: "h2", text: "JPG: for photographs" },
      {
        type: "p",
        text: "JPG throws away detail your eye is bad at noticing, particularly fine colour variation. On a photograph that works beautifully — you can discard most of the data and see almost no difference. On a screenshot, a logo, or a chart, the same trick produces visible smudging around hard edges, because sharp black-on-white boundaries are exactly what the format is worst at.",
      },
      {
        type: "p",
        text: "JPG also cannot store transparency. Save a logo with a transparent background as JPG and the transparency becomes solid white.",
      },
      { type: "h2", text: "PNG: for graphics and transparency" },
      {
        type: "p",
        text: "PNG is lossless: what goes in comes out, pixel for pixel, however many times you re-save it. That makes it right for screenshots, diagrams, logos, line art, and anything with text in the picture. It also supports transparency properly.",
      },
      {
        type: "p",
        text: "The cost is size. A photograph saved as PNG can easily be five to ten times larger than the same photograph as JPG, with no visible benefit. This is the single most common image mistake: someone screenshots a photo, gets a PNG, and wonders why it is enormous.",
      },
      { type: "h2", text: "WebP: newer, smaller, slightly awkward" },
      {
        type: "p",
        text: "WebP does both jobs — it has a lossy mode that competes with JPG and a lossless mode that competes with PNG, and it supports transparency in both. At comparable quality it is typically meaningfully smaller than either, which is why it has become common on the web.",
      },
      {
        type: "p",
        text: "The awkwardness is outside the browser. Every current browser displays WebP, but plenty of desktop applications, older phones, print workflows and upload forms still do not accept it. That gap is why converting WebP back to JPG or PNG is such a common task: you downloaded an image from a website and now something will not open it.",
      },
      { type: "h2", text: "A short decision list" },
      {
        type: "list",
        items: [
          "Photograph going on a website: WebP, with JPG as the fallback if you need maximum compatibility.",
          "Photograph going to someone by email or into a document: JPG.",
          "Screenshot, chart, diagram or anything containing text: PNG.",
          "Logo or graphic that needs a transparent background: PNG, or WebP if it is only for the web.",
          "A WebP that something refuses to open: convert to JPG for photos, PNG for graphics.",
        ],
      },
      {
        type: "note",
        title: "Converting never restores what is gone",
        text: "Every JPG save discards detail, and converting that JPG to PNG afterwards locks in the damage rather than repairing it — you get a lossless copy of a lossy image, which is just a larger file. Always convert from the best original you have, and avoid repeatedly editing and re-saving JPGs.",
      },
      { type: "h2", text: "How our image tools work" },
      {
        type: "p",
        text: "All of the image tools on this site run in your browser using the Canvas API. Your images are not uploaded to our server. One consequence worth knowing: because conversion goes through the browser's own image handling, transparency is preserved when converting to PNG or WebP but becomes solid white when converting to JPG, since JPG has no way to store it.",
      },
    ],
    faqs: [
      {
        q: "Which format has the best quality?",
        a: "The question does not quite work. PNG and lossless WebP are exact copies. JPG and lossy WebP discard detail on purpose in exchange for size. For a photograph at a sensible quality setting all three look the same to the eye; the real difference is file size and what happens at sharp edges.",
      },
      {
        q: "Should I convert my whole photo library to WebP?",
        a: "For a website, often yes. For personal archives, probably not — keep originals in a widely supported format and convert copies as needed.",
      },
      {
        q: "Why did my transparent background turn white?",
        a: "You converted to JPG, which cannot store transparency. Use PNG or WebP instead.",
      },
      {
        q: "What about HEIC from my iPhone?",
        a: "HEIC is efficient but poorly supported outside Apple devices. Convert to JPG when sharing with anyone else, which is what our HEIC to JPG tool is for.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-browser-based-file-processing-works",
    title: "How Browser-Based File Processing Works",
    metaTitle: "How Browser-Based File Processing Works - ProToolHub Guide",
    metaDescription:
      "Why some online tools never upload your file, how that is technically possible, and which ProToolHub tools work which way.",
    summary:
      "Some of these tools upload your file and some genuinely never do. The distinction is real, it is checkable, and it should affect which tool you reach for.",
    updated: "2026-09-04",
    category: "How it works",
    relatedTools: [
      { href: "/tools/compress-image", label: "Compress Image" },
      { href: "/tools/pdf-to-jpg", label: "PDF to JPG" },
      { href: "/tools/video-resizer", label: "Video Resizer" },
    ],
    relatedGuides: ["jpg-png-webp-which-format", "convert-pdf-pages-to-jpg", "how-to-compress-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "\"Your files are processed securely\" is the sort of sentence every file-conversion site prints, and it tells you nothing. The question worth asking is more concrete: does my file leave this computer at all? For roughly half the tools here the answer is no, and that is a genuine architectural difference rather than a promise about how carefully we behave.",
      },
      { type: "h2", text: "What changed in browsers" },
      {
        type: "p",
        text: "For most of the web's history, a browser could not do much with a file beyond sending it somewhere. Two developments changed that. The Canvas API gave JavaScript the ability to decode, draw and re-encode images directly. WebAssembly then made it possible to run code originally written in languages like C at close to native speed inside a browser tab — which means genuinely heavy software can be compiled and shipped as part of a web page.",
      },
      {
        type: "p",
        text: "FFmpeg is the clearest example. It is the video processing tool that sits underneath a very large amount of the industry, and a WebAssembly build of it runs inside your browser. When you resize a video here, that is FFmpeg doing the work on your own processor.",
      },
      { type: "h2", text: "Which tools work which way" },
      {
        type: "h3", text: "Entirely in your browser" },
      {
        type: "list",
        items: [
          "All image tools — compressing, resizing, cropping, adding text, converting between JPG, PNG, WebP and HEIC, and removing backgrounds.",
          "All video tools — trimming, compressing, muting, rotating, resizing, and converting between formats.",
          "The data converters — CSV to JSON, JSON to CSV, XML to JSON.",
          "PDF to JPG, which renders each page on your machine.",
        ],
      },
      { type: "h3", text: "On our server" },
      {
        type: "list",
        items: [
          "Most PDF tools: merging, splitting, rotating, compressing, page numbers, removing and reordering pages, watermarking, unlocking and comparing.",
          "Conversions that need a full office suite — Word, Excel, PowerPoint and HTML to PDF — because those rely on LibreOffice.",
          "PDF to Word, PDF to Excel and PDF to Text.",
          "The AI writing tools, which send your text to a language model provider.",
          "Translate PDF, which extracts the text and sends it to a translation service.",
        ],
      },
      { type: "h2", text: "How to tell for yourself" },
      {
        type: "p",
        text: "You do not have to take our word for any of this. Open your browser's developer tools, switch to the network tab, and run the tool. A server-side tool shows a request carrying your file. A browser-side tool shows no such request at all. It is worth doing once on any site that makes claims about your privacy, including this one.",
      },
      { type: "h2", text: "What each approach costs you" },
      {
        type: "p",
        text: "Browser processing is not free of trade-offs. The engine has to be downloaded — FFmpeg is around 25 MB the first time you use a video tool in a session — and it comes from a public code network, which sees your IP address in the same way any website you visit does. The work then runs on your hardware, so a laptop will handle a long video that a phone will not.",
      },
      {
        type: "p",
        text: "Server processing is the opposite: nothing large to download, consistent speed regardless of your device, and the ability to use software that cannot be compiled for a browser. The cost is that your file travels. When it does, it goes over an encrypted connection, is held in memory for the length of the request, and is returned without being saved — but it has still been somewhere other than your computer, and for genuinely sensitive material that matters.",
      },
      {
        type: "note",
        title: "A reasonable rule",
        text: "If a document is confidential, prefer the browser-side tools, and check the network tab if it matters enough. If it is an ordinary file and you want it done quickly on any device, the server-side tools are the practical choice. Our Privacy Policy sets out exactly what happens in each case.",
      },
    ],
    faqs: [
      {
        q: "If nothing is uploaded, how does the site know what to do?",
        a: "The processing code is part of the page you already downloaded. Your file is opened by that code inside the tab, on your machine. The site does not need to see it.",
      },
      {
        q: "Does browser processing work offline?",
        a: "Partly. Once a page and its engine are loaded, some tools will keep working without a connection, but this is not designed as an offline application and we would not rely on it.",
      },
      {
        q: "Why is the first video conversion so slow to start?",
        a: "It is downloading the FFmpeg engine, around 25 MB. Later conversions in the same session reuse it and start immediately.",
      },
      {
        q: "Is browser processing less capable?",
        a: "For images and video it is close to equivalent. Where it falls down is jobs needing large external software — converting a Word document properly means running an office suite, which is not something a browser tab can do.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "pdf-vs-jpg-which-format",
    title: "PDF or JPG: Which Should You Send?",
    metaTitle: "PDF vs JPG - Which Format Should You Use - ProToolHub Guide",
    metaDescription:
      "When a document should stay a PDF, when an image is the right answer, and what you give up each time you convert between them.",
    summary:
      "One holds a document; the other holds a picture of one. Choosing badly is why people end up with unsearchable contracts and rejected uploads.",
    updated: "2026-09-04",
    category: "How it works",
    relatedTools: [
      { href: "/tools/pdf-to-jpg", label: "PDF to JPG" },
      { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
      { href: "/tools/pdf-to-text", label: "PDF to Text" },
    ],
    relatedGuides: ["convert-pdf-pages-to-jpg", "jpg-png-webp-which-format", "how-to-compress-a-pdf"],
    blocks: [
      {
        type: "p",
        text: "These two formats get compared as though they were alternatives, which they are not really. A PDF describes a document: text as text, fonts, vector shapes, pages, structure. A JPG stores a grid of coloured pixels. Converting a PDF to JPG is not changing the container — it is photographing the document and keeping the photograph.",
      },
      { type: "h2", text: "What each one keeps" },
      {
        type: "h3", text: "PDF" },
      {
        type: "list",
        items: [
          "Text stays text: searchable, selectable, copyable, and readable by screen readers.",
          "Charts and line art stay vector, so they are sharp at any zoom.",
          "Multiple pages live in one file.",
          "Layout is fixed — it looks the same wherever it opens, which is the reason the format exists.",
        ],
      },
      { type: "h3", text: "JPG" },
      {
        type: "list",
        items: [
          "Universally accepted. Everything opens a JPG, including places that reject PDFs outright.",
          "Displays inline. A JPG shows up in a chat, a feed or an email body rather than sitting there as an attachment.",
          "One image per file, always.",
          "No text, no vectors, no structure — only pixels.",
        ],
      },
      { type: "h2", text: "Keep it a PDF when" },
      {
        type: "p",
        text: "Anyone needs to search it, quote from it, or read it with assistive technology. Anything official — contracts, invoices, applications, anything with legal weight. Anything with more than one page. Anything that might be printed, since a PDF prints at the printer's resolution while an image prints at whatever resolution it happens to have.",
      },
      { type: "h2", text: "Convert to JPG when" },
      {
        type: "p",
        text: "Something refuses to take a PDF. That is genuinely most of it: social platforms, many web forms, some chat apps, and slide software that will not place a PDF where you want it. Also when you want the content visible without anyone clicking an attachment — a single page as an image in an email body gets looked at far more often than the same page attached.",
      },
      {
        type: "note",
        title: "The conversion is one-way",
        text: "Turning a PDF into JPG discards the text layer permanently. Running the JPG back through JPG to PDF gives you a PDF again, but its pages are pictures — nobody can search or select the text any more. If you need both, keep the PDF as your master and treat the images as copies. If you have already lost the original, PDF to Text will only work if some real text survives; on an image-only page there is nothing to extract.",
      },
      { type: "h2", text: "The scanning trap" },
      {
        type: "p",
        text: "This is the same problem arriving from a different direction. A scanner produces images, and a scanned document saved as PDF is a stack of pictures in a PDF wrapper. It looks like a document and behaves like a photograph: you cannot search it, you cannot copy a paragraph out of it, and it is many times larger than the same document exported directly from a word processor. Whenever you have the choice, export to PDF from the original file rather than printing and scanning it.",
      },
      { type: "h2", text: "A quick answer" },
      {
        type: "p",
        text: "If someone is going to read it, keep it a PDF. If something is going to display it, make it a JPG. When you are not sure, send the PDF — it is easy to make an image from a document later, and impossible to recover a document from an image.",
      },
    ],
    faqs: [
      {
        q: "Which is smaller?",
        a: "For text, the PDF, usually by a wide margin — text is compact and an image of text is not. For a single photograph, the JPG, because a PDF wrapping it adds structure around the same image data.",
      },
      {
        q: "Can I get the text back out of a scanned PDF?",
        a: "Not with our tools. Extracting text from pictures of text needs OCR, which we do not currently offer. PDF to Text only returns text that genuinely exists in the file.",
      },
      {
        q: "Is a PDF more secure than a JPG?",
        a: "No. PDFs can carry passwords and permission flags, but those restrict opening and printing rather than protecting the content once it is open. Neither format protects a file you have sent to someone.",
      },
    ],
  },
];
