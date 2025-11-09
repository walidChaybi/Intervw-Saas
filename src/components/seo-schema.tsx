import {
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
} from "@/lib/seo";

export function SEOSchema() {
  const organizationSchema = generateOrganizationSchema();
  const softwareSchema = generateSoftwareApplicationSchema();
  const faqSchema = generateFAQSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
