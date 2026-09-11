"use client";

// The Framer ports, rendered by the Next app, in the same order as app/page.js.
//
// This page exists to check the ported copies against the real site without
// pasting them into Framer first. It is not part of the site: nothing links to
// it, sitemap.js does not list it, and app/page.js still renders the real
// components from components/.
//
// Three things make the ports run here at all, and they are the whole reason
// this file looks different from app/page.js:
//
//   · "use client" above. None of the framer/ files carry the directive —
//     Framer has no server components — so the page has to declare it for the
//     whole import graph.
//   · The bare `framer` import inside Ribbons, VideoBackground and Work is
//     aliased to lib/framer-render-target.js in next.config.mjs.
//   · Styling arrives from injectHappenCSS(), which every ported file calls at
//     module level. It only runs in the browser, so this page paints unstyled
//     for one frame before hydration. On the published Framer page the same
//     sheet is in the head, from head.html, and that never happens.
//
// Preloader is not ported yet, so the page starts at Nav.

import Nav, { NavPlaceholder } from "@/framer/Nav.tsx";
import Hero from "@/framer/Hero.tsx";
import Events from "@/framer/Events.tsx";
import Ribbons from "@/framer/Ribbons.tsx";
import Vendors from "@/framer/Vendors.tsx";
import Work from "@/framer/Work.tsx";
import Services from "@/framer/Services.tsx";
import Artists from "@/framer/Artists.tsx";
import Venues from "@/framer/Venues.tsx";
import About from "@/framer/About.tsx";
import TestimonialsHosts from "@/framer/TestimonialsHosts.tsx";
import Instagram from "@/framer/Instagram.tsx";
import Contact from "@/framer/Contact.tsx";
import VideoBackground from "@/framer/VideoBackground.tsx";

export default function FramerComponents() {
  return (
    <>
      <Nav />
      <NavPlaceholder />
      {/* pageMain comes from the injected sheet, not from a CSS module. The id
          is what Framer's own content wrapper is called, and Ribbons and
          VideoBackground both reach for it, so having it here exercises the
          same code path the published page takes. */}
      <main id="main" className="pageMain">
        <Hero />
        <Events />
        <Ribbons />
        <Vendors />
        <Work />
        <Services />
        <Artists />
        <Venues />
        <About />
        {/* One component, not Section + Testimonials + Hosts. The port owns the
            Section that app/page.js provides, so the 1024px breakpoint between
            the two halves stays in the CSS. */}
        <TestimonialsHosts />
        <Instagram />
        <Contact />
      </main>
      <VideoBackground />
    </>
  );
}
