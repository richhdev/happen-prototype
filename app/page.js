import Preloader from "@/components/Preloader/Preloader";
import Nav, { NavPlaceholder } from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import Work from "@/components/Work/Work";
import Vendors from "@/components/Vendors/Vendors";
import Artists from "@/components/Artists/Artists";
import About from "@/components/About/About";
import Events from "@/components/Events/Events";
import Instagram from "@/components/Instagram/Instagram";
import Contact from "@/components/Contact/Contact";
import Testimonials from "@/components/Testimonials/Testimonials";
import Hosts from "@/components/Hosts/Hosts";
import Ribbons from "@/components/Ribbons/Ribbons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <NavPlaceholder />
      <main className={styles.pageMain}>
        <Ribbons />
        <Hero />
        <Events />
        <Vendors />
        <Hosts />
        <Work />
        <Services />
        <Artists />
        <About />
        <Testimonials />
        <Instagram />
        <Contact />
      </main>
    </>
  );
}
