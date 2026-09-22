"use client";

import { useEffect } from "react";
import styles from "./EmbedSocialFeed.module.css";

const SCRIPT_ID = "EmbedSocialHashtagScript";
const SCRIPT_SRC = "https://embedsocial.com/cdn/ht.js";

// ht.js marks each feed element as it renders into it, so a remounted div is
// only filled if the script runs again — hence the re-append rather than the
// vendor snippet's "already there, do nothing" guard.
export function EmbedSocialFeed({ embedRef, className }) {
  useEffect(() => {
    document.getElementById(SCRIPT_ID)?.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, [embedRef]);

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
