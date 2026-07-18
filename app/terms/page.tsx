import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "../legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — SupplierDrop",
  description: "The terms that govern your use of SupplierDrop.",
};

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="July 18, 2026">
      <p>
        Welcome to SupplierDrop. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
        SupplierDrop website, dashboard, and product sourcing services (together, the &ldquo;Service&rdquo;) operated
        by SupplierDrop (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By creating an account or using the
        Service, you agree to these Terms. If you do not agree, please do not use the Service.
      </p>

      <LegalSection n={1} title="The Service">
        <p>
          SupplierDrop is a product sourcing platform. Merchants can browse our curated product catalog, view supplier
          pricing and details, and send sourcing requests to our team via WhatsApp. We connect merchants with
          suppliers; we facilitate sourcing conversations and quotations.
        </p>
        <p>
          Product information in the catalog — including prices, margins, stock levels, ratings, and shipping
          estimates — is indicative and provided by suppliers. Final prices, availability, and delivery timelines are
          confirmed individually during the sourcing conversation before any order is agreed.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Accounts">
        <p>
          You must provide accurate information when creating an account and keep your login credentials secure. You
          are responsible for all activity that happens under your account. You must be at least 18 years old (or the
          age of majority in your jurisdiction) to use the Service.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms, abuse the Service, or engage in fraudulent
          activity, at our reasonable discretion.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Sourcing requests and orders">
        <p>
          Submitting a sourcing request through the Service is an inquiry, not a binding order. Orders, prices,
          payment terms, and delivery arrangements are agreed separately between you and SupplierDrop (or the relevant
          supplier) during the sourcing conversation. Any contract of sale is formed only when both parties expressly
          confirm it.
        </p>
        <p>
          You agree to provide accurate details in your sourcing requests and to communicate in good faith with our
          sourcing team.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>use the Service for any unlawful purpose or in violation of any applicable law;</li>
          <li>attempt to gain unauthorised access to the Service, other accounts, or our systems;</li>
          <li>scrape, copy, or redistribute the catalog or Service content at scale without our written permission;</li>
          <li>upload malicious code or interfere with the operation of the Service;</li>
          <li>misrepresent your identity or affiliation.</li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Intellectual property">
        <p>
          The Service, including its design, software, and content (excluding supplier product data and your own
          content), is owned by SupplierDrop and protected by intellectual property laws. We grant you a limited,
          non-exclusive, non-transferable licence to use the Service for your business sourcing needs.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Disclaimers">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the maximum extent permitted
          by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular
          purpose, and non-infringement. We do not guarantee that the Service will be uninterrupted, error-free, or
          that catalog information is complete or current at all times.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, SupplierDrop shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill, arising
          from or related to your use of the Service. Our total liability for any claim relating to the Service shall
          not exceed the amount you paid us for the Service in the twelve months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Changes to the Service and these Terms">
        <p>
          We may modify the Service or these Terms from time to time. If we make material changes to the Terms, we
          will notify you by email or through the Service. Continued use of the Service after changes take effect
          constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Termination">
        <p>
          You may stop using the Service and close your account at any time. Sections that by their nature should
          survive termination (including intellectual property, disclaimers, and limitation of liability) will
          survive.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a href="mailto:husnainumer07@gmail.com" className="font-semibold text-brand hover:text-brand-hover">
            husnainumer07@gmail.com
          </a>{" "}
          or via WhatsApp through your dashboard.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
