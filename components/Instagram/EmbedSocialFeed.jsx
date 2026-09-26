"use client";

import { useEffect } from "react";
import { RenderTarget } from "framer";
import styles from "./EmbedSocialFeed.module.css";

const SCRIPT_ID = "EmbedSocialHashtagScript";
const SCRIPT_SRC = "https://embedsocial.com/cdn/ht.js";

// ht.js marks each feed element as it renders into it, so a remounted div is
// only filled if the script runs again — hence the re-append rather than the
// vendor snippet's "already there, do nothing" guard.
export function EmbedSocialFeed({ embedRef, className }) {
  // On the Framer canvas document.head is the editor's own, so loading the
  // vendor script there would run a third-party embed inside the editor on
  // every render. .feed reserves 320px and a charcoal background, so the space
  // is held either way. `framer` resolves to lib/framer-render-target.js
  // outside Framer, which always answers preview, so the feed always loads in
  // the Next app.
  const onCanvas = RenderTarget.current() === RenderTarget.canvas;

  useEffect(() => {
    if (onCanvas) return;
    document.getElementById(SCRIPT_ID)?.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, [embedRef, onCanvas]);

  return (
    <div
      className={`embedsocial-hashtag ${styles.feed} ${className ?? ""}`}
      data-ref={embedRef}
      data-dynamicload="yes"
      data-lazyload="yes"
    />
  );
}

export default EmbedSocialFeed;
