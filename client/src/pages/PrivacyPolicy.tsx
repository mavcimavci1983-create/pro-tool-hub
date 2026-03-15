import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <HelmetProvider>
      <Helmet><title>Privacy Policy - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            <p>ProToolHub ("we", "our", or "us") operates the website protoolhub.net. We are committed to protecting your privacy. This policy explains what information we collect and how we use it.</p>
            <p className="mt-3">We collect minimal information necessary to operate our services. When you use our tools, files you upload are processed entirely in your browser or on our secure servers and are never stored permanently. Files uploaded to our servers are automatically deleted within 1 hour of processing.</p>
            <p className="mt-3">We may collect anonymous usage data such as which tools are used, browser type, and general geographic region through analytics tools. This data cannot be used to identify you personally.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide and improve our online tools and services</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure the security and proper functioning of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cookies</h2>
            <p>ProToolHub uses cookies to enhance your browsing experience. These include essential cookies required for the site to function, and analytics cookies to help us understand how visitors interact with our tools. You can control cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of some tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Third-Party Services</h2>
            <p>We may use third-party analytics services such as Google Analytics to collect anonymous usage statistics. These services have their own privacy policies. We also display advertisements through third-party advertising networks, which may use cookies to serve relevant ads based on your browsing habits.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
            <p>We implement SSL/TLS encryption on all data transmitted between your browser and our servers. Files processed by our tools are handled with strict security protocols and deleted automatically after processing. We do not sell, trade, or otherwise transfer your information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete any personal information we may hold about you. Since we collect minimal personal data, most interactions with ProToolHub are completely anonymous. For any privacy-related requests, please contact us at privacy@protoolhub.net.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@protoolhub.net" className="text-blue-600 hover:underline">privacy@protoolhub.net</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
