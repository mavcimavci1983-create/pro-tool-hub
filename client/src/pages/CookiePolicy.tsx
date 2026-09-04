import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function CookiePolicy() {
  return (
    <HelmetProvider>
      <Helmet><title>Cookie Policy - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Cookie Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: September 2026</p>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Ask You About</h2>
            <p>When you first open ProToolHub you are asked to make a choice. Until you do, neither of the categories below is switched on, and no analytics or advertising cookie is written.</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Analytics — off until you allow it.</strong> We use Google Analytics to see which tools are used and where the site is slow. The Google Analytics script is not loaded at all unless you allow this category.</li>
              <li><strong>Advertising — off until you allow it.</strong> We use Google AdSense. The AdSense script is present on every page so that Google can verify the site and deliver its own privacy messages, but it runs under a &ldquo;denied&rdquo; consent signal until you allow this category, which means it does not store an advertising cookie on your device and does not personalise ads to you.</li>
            </ul>
            <p className="mt-3">We send your choice to Google using Google Consent Mode, which is the mechanism Google provides for exactly this purpose.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Works Regardless of Your Choice</h2>
            <p>The tools themselves never depend on your cookie choice. You can use every tool on the site with everything rejected, and the tools that run inside your browser — the image, video and file conversion tools — keep working exactly the same way.</p>
            <p className="mt-3">Two things are stored in your browser&rsquo;s local storage rather than in cookies: your language selection, and the cookie choice you made on this page. Neither is sent to us or to anyone else, and both stay on your device until you clear your browser data.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changing or Withdrawing Your Choice</h2>
            <p>You can change your mind at any time. Select <strong>Cookie Settings</strong> in the footer of any page to reopen the panel and turn either category on or off. A change takes effect immediately; withdrawing consent stops further use of that category, though it does not delete data already collected while consent was in place.</p>
            <p className="mt-3">You can also control and delete cookies through your browser settings, independently of the choice you make here.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p>Questions about our Cookie Policy? Email us at <a href="mailto:privacy@protoolhub.net" className="text-blue-600 hover:underline">privacy@protoolhub.net</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
