import { PortalAcademy } from "../components/portal/PortalAcademy";
import { PortalCategories } from "../components/portal/PortalCategories";
import { PortalContact } from "../components/portal/PortalContact";
import { PortalHero } from "../components/portal/PortalHero";
import { PortalNews } from "../components/portal/PortalNews";
import { PortalProjects } from "../components/portal/PortalProjects";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white text-slate-950">
        <PortalHero />
        <PortalCategories />
        <PortalProjects />
        <PortalAcademy />
        <PortalNews />
        <PortalContact />
      </main>

      <SiteFooter />
    </>
  );
}