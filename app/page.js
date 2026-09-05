import SiteBackground from "@/components/SiteBackground/SiteBackground";
import Nav, { NavPlaceholder } from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import Work from "@/components/Work/Work";
import Vendors from "@/components/Vendors/Vendors";
import Artists from "@/components/Artists/Artists";
import Venues from "@/components/Venues/Venues";
import About from "@/components/About/About";
import Events from "@/components/Events/Events";
import Instagram from "@/components/Instagram/Instagram";
import Contact from "@/components/Contact/Contact";
import Section from "@/components/Section/Section";
import Testimonials from "@/components/Testimonials/Testimonials";
import Hosts from "@/components/Hosts/Hosts";
import Ribbon from "@/components/Ribbons/Ribbons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteBackground />
      <Nav />
      <NavPlaceholder />
      <main className={styles.main}>
        <Hero />
        <Ribbon name="events" />
        <Events />
        <Vendors />
        <Work />
        <Services />
        <Ribbon name="artists" />
        <Artists />
        <Venues />
        <Ribbon name="about" />
        <About />
        <Section innerClassName={styles.testimonialsHostsGroup}>
          <Testimonials />
          <Hosts />
        </Section>
        <Ribbon name="instagram" />
        <Instagram />
        <Contact />
      </main>
    </>
  );
}
