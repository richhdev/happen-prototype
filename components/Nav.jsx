"use client";
import { useEffect, useState } from "react";
import { NAV_LINKS, asset } from "@/lib/data";

const cssEase = "cubic-bezier(.16,1,.3,1)";

export default function Nav() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const update = () => {
      const center = window.innerHeight / 2;
      let best = null;
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= center && r.bottom >= center) best = id;
      });
      setActiveId(best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollTo = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const y =
      id === "b-artists"
        ? window.scrollY + r.top + r.height / 2 - window.innerHeight / 2
        : window.scrollY + r.top;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  const toTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const left = NAV_LINKS.slice(0, 4);
  // const right = NAV_LINKS.slice(4);

  const navBase = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
    height: 76,
  };

  const linkStyle = (id) => ({
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: ".09em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: "#fff",
    opacity: id === activeId ? 1 : 0.55,
    transition: `opacity 200ms ${cssEase}`,
  });

  const Group = ({ items, justify, render }) => (
    <div
      style={{
        display: "flex",
        gap: 26,
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        justifyContent: justify,
      }}
    >
      {items.map(render)}
    </div>
  );

  return (
    <>
      {/* Live nav — mix-blend difference keeps text legible over any section */}
      <nav
        style={{
          ...navBase,
          background: "transparent",
          mixBlendMode: "difference",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            alignItems: "right",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          <Group
            items={NAV_LINKS}
            justify="flex-end"
            render={(n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => scrollTo(e, n.id)}
                style={linkStyle(n.id)}
              >
                {n.label}
              </a>
            )}
          />
          <a
            href="#a-contact"
            onClick={(e) => scrollTo(e, "a-contact")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".05em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#fff",
              border: "1.5px solid #fff",
              padding: "9px 18px",
              whiteSpace: "nowrap",
            }}
          >
            Work with us
          </a>

          {/* <a
            href="#"
            onClick={toTop}
            style={{
              flex: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: "0 28px",
              textDecoration: "none",
              overflow: "visible",
            }}
          >
            <img
              src={asset("/assets/logo.svg")}
              alt="Happen"
              style={{ height: 96, width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
            />
          </a> */}
          {/* <div
            style={{
              display: "flex",
              gap: 26,
              alignItems: "center",
              flex: 1,
              minWidth: 0,
              justifyContent: "flex-start",
            }}
          >
            {right.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => scrollTo(e, n.id)}
                style={linkStyle(n.id)}
              >
                {n.label}
              </a>
            ))}
            <a
              href="#a-contact"
              onClick={(e) => scrollTo(e, "a-contact")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#fff",
                border: "1.5px solid #fff",
                padding: "9px 18px",
                whiteSpace: "nowrap",
              }}
            >
              Work with us
            </a>
          </div> */}
        </div>
      </nav>
    </>
  );
}
