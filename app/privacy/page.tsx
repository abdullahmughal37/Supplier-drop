import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "../legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — SupplierDrop",
  description: "How SupplierDrop collects, uses, and protects your data.",
};

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 18, 2026">
      <p>
        This Privacy Policy explains how SupplierDrop (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
        collects, uses, and protects your personal information when you use our website and product sourcing service
        (the &ldquo;Service&rdquo;). By using the Service, you agree to the practices described here.
      </p>

      <LegalSection n={1} title="Information we collect">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <b>Account information</b> — your name, email address, and password (stored as a secure hash by our
            authentication provider; we never see or store your plain-text password). If you sign in with Google, we
            receive your name, email, and profile photo from Google.
          </li>
          <li>
            <b>Sourcing activity</b> — the products you request, optional notes you attach to requests, and the
            timestamps of your activity, so we can process your requests and show you their status.
          </li>
          <li>
            <b>Technical data</b> — standard log information such as IP address, browser type, and pages visited,
            used for security and to operate the Service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={2} title="How we use your information">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>to provide and operate the Service, including processing your sourcing requests;</li>
          <li>to contact you about your requests — including via WhatsApp when you initiate a WhatsApp conversation;</li>
          <li>to secure the Service, prevent abuse, and enforce our Terms;</li>
          <li>to improve the Service, using aggregated, non-identifying usage information;</li>
          <li>to send you service-related notices (we do not sell your data or send third-party marketing).</li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="WhatsApp communication">
        <p>
          When you tap &ldquo;Source on WhatsApp&rdquo;, your device opens WhatsApp with a pre-filled message
          containing the product details and any note you wrote. That conversation happens on WhatsApp and is governed
          by WhatsApp&apos;s own terms and privacy policy. We record the sourcing request itself (product, note, time)
          in your account so you and our team can track its status.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Where your data lives">
        <p>
          Your data is stored with Google Firebase (Authentication and Cloud Firestore) in Google Cloud data centres
          in the United States, protected by industry-standard encryption in transit and at rest. Access is restricted
          by security rules: you can only read your own profile and requests, and only authorised administrators can
          access management data.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Sharing">
        <p>We share personal information only:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>with suppliers, to the extent needed to fulfil a sourcing request you initiated;</li>
          <li>with service providers that host and operate our infrastructure (Google Firebase, Render);</li>
          <li>when required by law or to protect our legal rights.</li>
        </ul>
        <p>We never sell your personal information.</p>
      </LegalSection>

      <LegalSection n={6} title="Data retention and deletion">
        <p>
          We keep your account data while your account is active. You can request deletion of your account and
          associated personal data at any time by contacting us; we will delete it within 30 days except where we
          must retain records to comply with legal obligations.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, export, or delete your personal data,
          and to object to or restrict certain processing. To exercise any of these rights, contact us using the
          details below and we will respond within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Security">
        <p>
          We use reasonable technical and organisational measures to protect your data, including encrypted
          connections (HTTPS), hashed passwords, role-based access controls enforced at the database level, and least
          privilege administrative access. No method of transmission or storage is 100% secure, but we work to protect
          your information appropriately.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be announced by email or through
          the Service. The &ldquo;Last updated&rdquo; date at the top shows the current version.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contact">
        <p>
          Privacy questions or requests:{" "}
          <a href="mailto:husnainumer07@gmail.com" className="font-semibold text-brand hover:text-brand-hover">
            husnainumer07@gmail.com
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
