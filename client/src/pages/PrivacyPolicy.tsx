import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

/**
 * Gizlilik Politikasi.
 *
 * Buradaki her cumle kodda dogrulanabilir olmali. Onceki surum, uygulanmayan
 * bir saklama sureci ("1 saat icinde silinir") anlatiyor, Google Analytics ve
 * AdSense'i adiyla anmiyor ve gercekte veri alan uc taraflarin bir kismini hic
 * belirtmiyordu.
 *
 * Dogrulanan davranis:
 *   - Tum multer yapilandirmalari memoryStorage kullanir (7/7).
 *   - Office -> PDF donusumu libreoffice-convert uzerinden gecici bir dizine
 *     yazar ve isini bitirince siler (tmp unsafeCleanup + removeCallback).
 *   - Iletisim formu ad/e-posta/mesaj ile birlikte IP ve user-agent bilgisini
 *     SQLite'a yazar (server/contact-store.ts) - silme islemi kodda yok.
 *   - Gorsel/video/donusturucu araclari sunucuya hicbir istek yapmaz.
 *   - Uc taraflar: Google (Analytics, AdSense, Fonts), Anthropic (AI yazma),
 *     Google Translate (PDF ceviri), unpkg ve cdnjs (kutuphaneler).
 */
export default function PrivacyPolicy() {
  return (
    <HelmetProvider>
      <Helmet><title>Privacy Policy - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: September 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Who We Are</h2>
            <p>ProToolHub ("we", "our", or "us") operates the website protoolhub.net, a collection of free online tools for working with PDFs, images, video, data files and AI-assisted writing. This policy explains what happens to your information when you use the site.</p>
            <p className="mt-3">There are no user accounts on ProToolHub. You do not register, log in, or give us your name to use any tool.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. What Happens to the Files You Process</h2>
            <p>This depends on the tool, and the difference is worth understanding.</p>

            <p className="mt-3"><strong>Tools that never send your file anywhere.</strong> Every image tool, every video tool and every data-format converter runs entirely inside your browser, using the Canvas API, FFmpeg compiled to WebAssembly, and JavaScript running on your own machine. PDF to JPG works this way too. For these tools your file is never uploaded, so there is nothing for us to store, see, or delete.</p>

            <p className="mt-3"><strong>Tools that do send your file to our server.</strong> Most PDF tools — merging, splitting, rotating, compressing, page numbering, watermarking, unlocking, comparing, translating, and converting to or from Office formats — send the file to us over an encrypted (HTTPS) connection.</p>

            <p className="mt-3">When that happens, the file is held in the server's memory only for as long as the request takes, and the result is sent straight back to you. We do not write your file to a database, and no part of our code saves it for later. Two honest caveats: converting Word, Excel, PowerPoint or HTML to PDF hands the file to LibreOffice, which writes it into a temporary folder on the server and removes that folder when the conversion finishes; and if the server were to crash mid-request, ordinary operating-system behaviour applies to whatever was in memory or in that temporary folder at the time. We are describing how the system is built rather than making a guarantee we cannot enforce.</p>

            <p className="mt-3">We do not open your files to look at their contents, and we do not use them to train anything.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information We Collect</h2>
            <p><strong>If you use the contact form.</strong> We store the name, email address and message you type, together with the IP address the message came from and your browser's user-agent string, in a database on our server. We keep these messages so we can reply and so we can recognise repeated abuse of the form. They stay there until we delete them; you can ask us to remove yours at any time using the contact details in section 8.</p>
            <p className="mt-3">If you have set up a forwarding webhook — for example to a team chat — the name, email address and message are also sent to that destination. The IP address and user-agent are not.</p>

            <p className="mt-3"><strong>If you only use the tools.</strong> We do not ask for or record anything about you. Our server keeps ordinary short-lived operational logs of requests, as almost every web server does.</p>

            <p className="mt-3"><strong>Analytics.</strong> Where you have allowed it, Google Analytics collects usage information about your visit. This is covered in section 4.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Cookies, Analytics and Advertising</h2>
            <p>ProToolHub uses two Google services that can set cookies: <strong>Google Analytics</strong>, to understand which tools people use, and <strong>Google AdSense</strong>, to show advertising.</p>

            <p className="mt-3">Neither runs freely until you decide. The first time you visit, we ask you to choose, and until you do we tell Google — using its Consent Mode mechanism — that advertising storage, advertising personalisation, advertising user data and analytics storage are all denied. In practice:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>The Google Analytics script is not loaded onto the page at all unless you allow analytics.</li>
              <li>The Google AdSense script is present on every page, because Google needs it there to verify the site and to deliver its own privacy messages, but while advertising is denied it does not store an advertising cookie on your device and does not personalise ads to you.</li>
            </ul>
            <p className="mt-3">You can change or withdraw your choice at any time with the <strong>Cookie Settings</strong> link in the footer of any page. Google describes its own use of data on advertising partner sites at <a href="https://policies.google.com/technologies/partner-sites" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">policies.google.com/technologies/partner-sites</a>, and you can manage ad personalisation across Google at <a href="https://myadcenter.google.com" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">myadcenter.google.com</a>.</p>

            <p className="mt-3">Separately from cookies, the site keeps two small values in your browser's local storage: your language selection and the cookie choice you made. Both stay on your device and are never sent to us. Our <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a> goes through this in more detail.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third Parties That Receive Data</h2>
            <p>These are the outside services involved when you use the site, and what reaches each one:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Google</strong> (Analytics, AdSense, Fonts) — receives your IP address and browsing information as described in section 4. Google Fonts is used for the site's typeface and receives your IP address as part of loading it.</li>
              <li><strong>Anthropic</strong> — the AI writing tools send the text you type, or the text extracted from a document you upload, to Anthropic's API to generate a result. It is not saved to our database afterwards.</li>
              <li><strong>Google Translate</strong> — the Translate PDF tool extracts the text from your PDF and sends it to Google's translation service. If your PDF is confidential, this is the one PDF tool where its text leaves our infrastructure.</li>
              <li><strong>unpkg and cdnjs</strong> — the video and image tools download processing libraries (FFmpeg, pdf.js, HEIC support) from these public code networks. They receive your IP address as part of serving those files. Your media itself is never sent to them.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information, and we do not share it with anyone beyond the services listed above.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Security</h2>
            <p>Traffic between your browser and our servers is encrypted with HTTPS (TLS), which is the standard protection used across the web. Uploads are size-limited and checked against the file types each tool accepts, and server-side processing runs under time limits so a single request cannot tie up the service.</p>
            <p className="mt-3">The strongest privacy protection on this site is architectural rather than a promise: for image, video and data-conversion tools, your file simply never leaves your computer.</p>
            <p className="mt-3">No website can promise perfect security, and we do not. If you are handling genuinely sensitive material, prefer the tools that run in your browser.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p>Depending on where you live, you may have the right to access, correct, delete or export the personal information we hold about you, to object to how we use it, and to complain to your local data protection authority. Because we run no accounts and collect nothing about you unless you write to us, in practice this almost always concerns a message you sent through the contact form.</p>
            <p className="mt-3">You can also withdraw your cookie consent at any time through <strong>Cookie Settings</strong> in the footer, without affecting your ability to use any tool on the site.</p>
            <p className="mt-3">To make a request, email us at <a href="mailto:privacy@protoolhub.net" className="text-blue-600 hover:underline">privacy@protoolhub.net</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
            <p>We may update this policy as the site changes. The date at the top of this page always shows when it was last revised, and material changes will be announced on the site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact</h2>
            <p>Questions about this policy, or about anything on this page, can go to <a href="mailto:privacy@protoolhub.net" className="text-blue-600 hover:underline">privacy@protoolhub.net</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
