"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Reveal } from "@/components/ui";
import { EASE, asset } from "@/lib/data";

export default function Contact() {
  return (
    <section id="a-contact" className="contact">
      <Reveal>
        <div className="heading-group">
          <span className="eyebrow">Contact</span>
          <motion.h2
            initial={{ letterSpacing: ".14em" }}
            whileInView={{ letterSpacing: "-.035em" }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 1.4, ease: EASE }}
            style={{ margin: 0 }}
          >
            <span className="heading">
              Let&apos;s make
              <br />
              it Happen
            </span>
          </motion.h2>
          <p className="lede">
            Got a festival to run? A market village to fill? An artist who needs
            looking after? Tell us what you need.
          </p>
        </div>
      </Reveal>

      <div className="grid">
        <div className="panel">
          <div className="label">General enquiries</div>
          <a href="mailto:hello@happengroup.com.au" className="email">
            hello@happengroup.com.au
          </a>
          <div className="label">Follow along</div>
          <div className="social-row">
            <a
              href="https://www.instagram.com/happengroupau/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-instagram"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/happengroupau"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-facebook"
            >
              Facebook
            </a>
            <a
              href="https://www.youtube.com/@HappenGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-youtube"
            >
              YouTube
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-spotify"
            >
              Spotify
            </a>
          </div>
        </div>

        <div className="panel panel-links">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfGExZGlBSpbc4ciG6nipO5i0NgDDcdFpXRqtsu3CWuMCBO9Q/viewform"
            className="link-row link-row-bordered"
          >
            <div>
              <h3 className="link-title">Work with us</h3>
              <p className="link-desc">
                Register your interest to hear about casual work opportunities
                in the events industry
              </p>
            </div>
            <span className="link-arrow">↗</span>
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdxwNLMLijvqMuaeHtV8M2FsPSfGB4g0ZVlATtbpdbBntmL6A/viewform"
            className="link-row"
          >
            <div>
              <h3 className="link-title">
                Promoter / Micro Influencer Sign up
              </h3>
              <p className="link-desc">
                If you know how to hype a party, we want you on the team
              </p>
            </div>
            <span className="link-arrow">↗</span>
          </a>
        </div>

        <ContactLogo />
      </div>

      <style jsx>{`
        .contact {
          padding: 130px 48px 90px;
          background: #111;
          color: #eeebe3;
        }

        .heading-group {
          margin: 0 auto 56px;
          max-width: 760px;
          text-align: center;
        }

        .eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 16px;
        }

        .heading {
          display: block;
          font-size: 76px;
          font-weight: 900;
          text-transform: uppercase;
          line-height: 0.95;
          margin: 0 0 20px;
          color: #fff;
        }

        .lede {
          font-size: 16px;
          color: #c9c4b7;
          font-weight: 600;
          max-width: 640px;
          line-height: 1.6;
          margin-left: auto;
          margin-right: auto;
          text-wrap: balance;
        }

        .logo-wrap {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 64px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }

          .logo-wrap {
            grid-column: 1 / -1;
          }
        }

        .panel {
          background: #1b1b1b;
          padding: 40px;
        }

        .label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 10px;
        }

        .email {
          display: inline-block;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: none;
          margin-bottom: 34px;
        }

        .social-row {
          display: flex;
          gap: 20px;
        }

        .social-link {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #c9c4b7;
          text-decoration: none;
        }

        .social-link-instagram {
          color: #e1306c;
        }

        .social-link-facebook {
          color: #1877f2;
        }

        .social-link-youtube {
          color: #ff0000;
        }

        .social-link-spotify {
          color: #1db954;
        }

        .panel-links {
          padding: 8px 32px;
        }

        .link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 4px;
          text-decoration: none;
          color: #fff;
        }

        .link-row-bordered {
          border-bottom: 1px solid #444;
        }

        .link-title {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }

        .link-desc {
          font-size: 12px;
          color: #8f8a7e;
          margin: 4px 0 0;
        }

        .link-arrow {
          font-size: 20px;
        }
      `}</style>
    </section>
  );
}

const LOGO_H = 125;
const CIRCUMFERENCE = Math.PI * LOGO_H;

// Logo rolls in from off the left edge to rest at centre as the section enters.
function ContactLogo() {
  const [winW, setWinW] = useState(1440);

  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Tracks whole-page scroll (0 at the top, 1 at the very bottom). The roll
  // only starts over the final 10% of the page, so the same travel distance
  // is compressed into a shorter scroll window — more sensitive per pixel
  // scrolled — landing centred exactly at page end.
  const { scrollYProgress } = useScroll();
  const rawX = useTransform(scrollYProgress, [0.9, 1], [-(winW / 2 + 400), 0]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(x, (v) => (v / CIRCUMFERENCE) * 360);

  return (
    <div className="logo-wrap">
      <motion.img
        src={asset("/assets/logo.svg")}
        alt="Happen logo"
        style={{
          display: "block",
          height: LOGO_H,
          width: "auto",
          willChange: "transform",
          x,
          rotate,
        }}
      />

      <style jsx>{`
        .logo-wrap {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 64px;
        }

        @media (min-width: 768px) {
          .logo-wrap {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
}
