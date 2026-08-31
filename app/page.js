import SiteBackground from "@/components/SiteBackground/SiteBackground";
import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Vendors from "@/components/Vendors/Vendors";
import Testimonials from "@/components/Testimonials";
import Artists from "@/components/Artists";
import Venues from "@/components/Venues";
import About from "@/components/About";
import Events from "@/components/Events/Events";
import WhatsOnCms from "@/components/WhatsOnCms";
import Traders from "@/components/Traders";
import Instagram from "@/components/Instagram";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* <SiteBackground /> */}
      <main style={{ width: "100%" }}>
        <Nav />
        <Hero />
        <Events />
        <Vendors />
        <Work />
        <Services />
        <Testimonials />
        <Artists />
        <Venues />
        <About />
        <Traders />
        <Instagram />
        <Contact />
      </main>
    </>
  );
}
