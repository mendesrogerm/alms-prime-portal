export function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ALMS Prime",
    url: "https://www.almsprime.com.br",
    logo: "https://www.almsprime.com.br/logo-alms-prime.png",
    description:
      "A ALMS Prime desenvolve soluções digitais, sistemas de gestão, portais institucionais, automações comerciais, dashboards e projetos sob medida.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55 11 96407-3364",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ALMS Prime",
    url: "https://www.almsprime.com.br",
    description:
      "Portal institucional da ALMS Prime para tecnologia, gestão, sistemas e soluções digitais.",
  };

  const navigationData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Navegação principal ALMS Prime",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Início",
        url: "https://www.almsprime.com.br",
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Sobre",
        url: "https://www.almsprime.com.br/sobre",
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Soluções",
        url: "https://www.almsprime.com.br/solucoes",
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Sistemas",
        url: "https://www.almsprime.com.br/sistemas",
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Gestão de Clientes",
        url: "https://www.almsprime.com.br/gestao-de-clientes",
      },
      {
        "@type": "SiteNavigationElement",
        position: 6,
        name: "Contato",
        url: "https://www.almsprime.com.br/contato",
      },
      {
        "@type": "SiteNavigationElement",
        position: 7,
        name: "Política de Privacidade",
        url: "https://www.almsprime.com.br/politica-de-privacidade",
      },
      {
        "@type": "SiteNavigationElement",
        position: 8,
        name: "Termos de Uso",
        url: "https://www.almsprime.com.br/termos-de-uso",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navigationData),
        }}
      />
    </>
  );
}
