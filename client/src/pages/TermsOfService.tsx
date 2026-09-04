import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function TermsOfService() {
  return (
    <HelmetProvider>
      <Helmet><title>Terms of Service - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: September 2026</p>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using ProToolHub (protoolhub.net), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
            <p>ProToolHub provides free online tools for processing PDF files, images, videos, and other document types. Our tools are provided as-is for personal and commercial use. We reserve the right to modify, suspend, or discontinue any service at any time without notice.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Acceptable Use</h2>
            <p>You agree to use ProToolHub only for lawful purposes. You must not upload files containing malicious code, use our services to process copyrighted material without authorization, attempt to overload or hack our servers, or violate any applicable laws.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. File Processing and Privacy</h2>
            <p>Many of our tools — every image tool, every video tool, the data-format converters and PDF to JPG — run entirely inside your browser, so those files are never uploaded to us at all. Where a tool does need our server, the file is held in memory only for as long as the request takes and the result is returned to you; nothing in our code saves it afterwards. We do not access the content of your files beyond what the tool needs to do its job. Our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> describes this in full, including the two tools that pass content to an outside service.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property</h2>
            <p>The ProToolHub name, logo, website design, and all content are the intellectual property of ProToolHub. You retain full ownership of all files you upload and process through our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Disclaimer of Warranties</h2>
            <p>ProToolHub services are provided as-is without warranties of any kind. We do not guarantee that our services will be uninterrupted or error-free. Always keep backup copies of important files before processing.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
            <p>ProToolHub shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability for any claim shall not exceed the amount paid by you for the service in the preceding 12 months.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting. Continued use of ProToolHub after changes constitutes acceptance of the updated terms.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact</h2>
            <p>Questions? Email us at <a href="mailto:legal@protoolhub.net" className="text-blue-600 hover:underline">legal@protoolhub.net</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
