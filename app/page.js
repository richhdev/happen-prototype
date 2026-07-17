import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Testimonials from "@/components/Testimonials";
import Artists from "@/components/Artists";
import Venues from "@/components/Venues";
import About from "@/components/About";
import WhatsOn from "@/components/WhatsOn";
import Traders from "@/components/Traders";
import Suppliers from "@/components/Suppliers";
import Instagram from "@/components/Instagram";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main style={{ width: "100%", background: "#EEEBE3" }}>
      <Nav />
      <Hero />
      <Services />
      <Work />
      <Testimonials />
      <Artists />
      <Venues />
      <About />
      <WhatsOn />
      <Traders />
      <Suppliers />
      <Instagram />
      <Contact />
    </main>
  );
}
