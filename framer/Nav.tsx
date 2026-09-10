// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
// Ported from components/Nav/ — Nav.jsx, LinkList.jsx, Underline.jsx,
// MobileNav.jsx, data.js and useActiveSection.js, combined.
// Paste into Framer as a code file named Nav.tsx.
//
// Only Nav and NavPlaceholder are exported. Framer lists every exported
// component in the Insert panel, and LinkList, Underline and MobileNav are
// internals — nobody should be able to drag a bare underline onto a canvas.

import { useEffect, useLayoutEffect, useState } from "react"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { TextOverline, Heading3 } from "./Primitives.tsx"

injectHappenCSS()

const LINKS = [
    { id: "a-events", label: "Events" },
    { id: "b-work", label: "Work" },
    { id: "a-services", label: "Services" },
    { id: "b-artists", label: "Artists" },
    { id: "a-about", label: "About" },
    { id: "a-hosts", label: "Hosts" },
    { id: "a-contact", label: "Contact" },
]

// React 19 accepts inert as a boolean; React 18 drops an unknown boolean
// attribute entirely, which would leave the hidden bar and the closed mobile
// menu reachable by keyboard. An empty string renders as inert="" on both.
const inertWhen = (on) => (on ? "" : undefined)

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Nav() {
    const activeId = useActiveSection(LINKS)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [menuOpen])

    const scrollToSection = (e, id) => {
        e.preventDefault()
        setMenuOpen(false)
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            // artists section should land at the end of its animation
            block: id === "b-artists" ? "end" : "start",
        })
    }

    const scrollToTop = (e) => {
        e.preventDefault()
        setMenuOpen(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <>
            <Bar
                activeId={activeId}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                scrollToSection={scrollToSection}
                scrollToTop={scrollToTop}
            />

            {/* keeps the navlinks from turning weird colors from `difference` */}
            <Bar
                className="navHueGuard"
                hidden
                activeId={activeId}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                scrollToSection={scrollToSection}
                scrollToTop={scrollToTop}
            />

            <MobileNav
                open={menuOpen}
                activeId={activeId}
                scrollToSection={scrollToSection}
            />
        </>
    )
}

// Reserves the fixed bar's height in the page flow.
export function NavPlaceholder() {
    return <div className="navPlaceholder" />
}

function Bar({
    className,
    hidden,
    activeId,
    menuOpen,
    setMenuOpen,
    scrollToSection,
    scrollToTop,
}) {
    return (
        <nav
            className={`nav${className ? ` ${className}` : ""}`}
            aria-hidden={hidden ? "true" : undefined}
            inert={inertWhen(hidden)}
        >
            <div className="navInner">
                <TextOverline
                    as="a"
                    href="/"
                    className="navTitle"
                    onClick={scrollToTop}
                >
                    Happen Group
                </TextOverline>

                <button
                    type="button"
                    className="navMenuToggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <TextOverline>{menuOpen ? "Close" : "Menu"}</TextOverline>
                </button>

                <LinkList
                    activeId={activeId}
                    scrollToSection={scrollToSection}
                />
            </div>
        </nav>
    )
}

function LinkList({ activeId, scrollToSection }) {
    const [list, setList] = useState(null)
    const [activeLink, setActiveLink] = useState(null)

    return (
        <div className="navLinks" ref={setList}>
            {LINKS.map((n) => (
                <TextOverline
                    as="a"
                    key={n.id}
                    href={`#${n.id}`}
                    ref={n.id === activeId ? setActiveLink : null}
                    onClick={(e) => scrollToSection(e, n.id)}
                    className="navLink"
                    aria-current={n.id === activeId ? "true" : undefined}
                >
                    {n.label}
                </TextOverline>
            ))}
            <Underline list={list} link={activeLink} />
        </div>
    )
}

/* One underline for the list, sliding to the active link. CSS can't size an
   element from a sibling (no anchor positioning in Firefox), so it's measured
   against the list box — both axes, for the row bar and the stacked overlay.
   Must render inside `list`, which is its containing block and scroll box. */
function Underline({ list, link }) {
    // Keeps its last geometry while nothing is active, so the rule fades out
    // where it was instead of collapsing to the left of the list.
    const [rule, setRule] = useState({ x: 0, y: 0, width: 0, visible: false })

    useLayoutEffect(() => {
        if (!list || !link) {
            setRule((r) => ({ ...r, visible: false }))
            return
        }

        const measure = () => {
            const listBox = list.getBoundingClientRect()
            const linkBox = link.getBoundingClientRect()
            setRule({
                x: linkBox.left - listBox.left + list.scrollLeft,
                y: linkBox.bottom - listBox.top + list.scrollTop,
                width: linkBox.width,
                visible: true,
            })
        }
        measure()

        // Catches the viewport resizing, the list scrolling sideways on a
        // narrow bar, and the webfont landing and changing the link's width.
        const observer = new ResizeObserver(measure)
        observer.observe(list)
        observer.observe(link)
        list.addEventListener("scroll", measure, { passive: true })
        return () => {
            observer.disconnect()
            list.removeEventListener("scroll", measure)
        }
    }, [list, link])

    return (
        <span
            aria-hidden="true"
            className={`navUnderline${rule.visible ? " navUnderlineVisible" : ""}`}
            style={{
                width: `${rule.width}px`,
                transform: `translate(${rule.x}px, ${rule.y}px)`,
            }}
        />
    )
}

function MobileNav({ open, activeId, scrollToSection }) {
    return (
        <div
            className={`mobileNavOverlay${open ? " mobileNavOpen" : ""}`}
            inert={inertWhen(!open)}
        >
            <div className="mobileNavLinks">
                {LINKS.map((n, i) => (
                    <a
                        key={n.id}
                        href={`#${n.id}`}
                        onClick={(e) => scrollToSection(e, n.id)}
                        className={`mobileNavLink${n.id === activeId ? " mobileNavActive" : ""}`}
                        aria-current={n.id === activeId ? "true" : undefined}
                        style={{ "--i": i, "--r": LINKS.length - 1 - i }}
                    >
                        <span className="mobileNavMask">
                            <Heading3
                                as="span"
                                animateTracking={false}
                                className="mobileNavLabel"
                            >
                                {n.label}
                            </Heading3>
                        </span>
                    </a>
                ))}
            </div>
        </div>
    )
}

// Which section owns the viewport, so its nav link can be underlined. A section
// qualifies on covering half the viewport — or half of itself, if it's shorter —
// and the most visible one wins. Nothing qualifies over the hero.
//
// This reads the section ids straight out of the document, so on the Framer
// canvas it finds nothing until the other sections are on the page. Until then
// activeId stays null and the underline correctly stays hidden.
function useActiveSection(links) {
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        const getActiveSection = () => {
            const viewportHeight = window.innerHeight
            let activeSectionId = null
            let mostVisible = 0
            links.forEach(({ id }) => {
                const r = document
                    .getElementById(id)
                    ?.getBoundingClientRect()
                if (!r) return
                const visible =
                    Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0)
                const majority = Math.min(viewportHeight, r.height) / 2
                if (visible <= majority || visible <= mostVisible) return
                mostVisible = visible
                activeSectionId = id
            })
            setActiveId(activeSectionId)
        }
        getActiveSection()
        window.addEventListener("scroll", getActiveSection, { passive: true })
        window.addEventListener("resize", getActiveSection, { passive: true })
        return () => {
            window.removeEventListener("scroll", getActiveSection)
            window.removeEventListener("resize", getActiveSection)
        }
    }, [links])

    return activeId
}
