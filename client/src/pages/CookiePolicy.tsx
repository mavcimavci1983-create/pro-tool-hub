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
        <p className="text-slate-500 mb-8">Last updated: March 2026</p>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Cookies</h2>
            <p>ProToolHub uses the following types of cookies:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our tools so we can improve them. These are anonymous.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings such as language preference.</li>
              <li><strong>Advertising Cookies:</strong> Used by our advertising partners to serve relevant advertisements.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Note that disabling cookies may affect the functionality of certain tools on our platform. Most browsers allow you to refuse cookies or alert you when cookies are being sent.</p>
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
