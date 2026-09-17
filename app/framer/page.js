"use client";

// This page exists to check the ported copies against the real site before
// pasting them into Framer.
//
// There are some mods to make this work in nextjs context:
//   · "use client" above. None of the framer/ files carry the directive —
//     Framer has no server components — so the page has to declare it for the
//     whole import graph.
//   · The bare `framer` import inside Ribbons, VideoBackground and Work is
//     aliased to lib/framer-render-target.js in next.config.mjs.
//   · Styling arrives from injectHappenCSS(), which every ported file calls at
//     module level. It only runs in the browser, so this page paints unstyled
//     for one frame before hydration. On the published Framer page the same
//     sheet is in the head, from GlobalStylesheetHead.html, and that never happens.
//
// Preloader is not ported yet, so the page starts at Nav.

import Nav, { NavPlaceholder } from "@/framer/Nav.tsx";
import Hero from "@/framer/Hero.tsx";
import Events from "@/framer/Events.tsx";
import Ribbons from "@/framer/Ribbons.tsx";
import VendorsClosed from "@/framer/VendorsClosed.tsx";
import Hosts from "@/framer/Hosts.tsx";
import Work from "@/framer/Work.tsx";
import Services from "@/framer/Services.tsx";
import Artists from "@/framer/Artists.tsx";
import About from "@/framer/About.tsx";
import Testimonials from "@/framer/Testimonials.tsx";
import Instagram from "@/framer/Instagram.tsx";
import Contact from "@/framer/Contact.tsx";

export default function FramerPage() {
  return (
    <>
      <Nav />
      {/* .pageMain matches framers actual structure */}
      <main id="main" className="pageMain">
        <NavPlaceholder />
        <Ribbons />
        <Hero />
        <Events />
        <VendorsClosed />
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
