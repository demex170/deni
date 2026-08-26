document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const desktopLinks = document.querySelectorAll(
        ".nav-menu a"
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-menu a"
    );

    const allNavLinks = document.querySelectorAll(
        ".nav-menu a, .mobile-menu a"
    );


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    if (menuToggle && mobileMenu) {

        /*
         * მენიუს გახსნა / დახურვა
         */

        const setMenuState = (open) => {

            mobileMenu.classList.toggle(
                "open",
                open
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(open)
            );

            menuToggle.setAttribute(
                "aria-label",
                open
                    ? "მენიუს დახურვა"
                    : "მენიუს გახსნა"
            );

            /*
             * თუ მენიუ გახსნილია → X
             * თუ დახურულია → ☰
             */

            menuToggle.innerHTML =
                open ? "✕" : "☰";

            /*
             * Body scroll-ის კონტროლი
             */

            document.body.classList.toggle(
                "menu-open",
                open
            );

        };


        /*
         * საწყისი მდგომარეობა
         */

        setMenuState(false);


        /*
         * Toggle
         */

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    mobileMenu.classList.contains("open");

                setMenuState(!isOpen);

            }
        );


        /*
         * Mobile link-ზე დაჭერისას
         * მენიუ ავტომატურად იხურება
         */

        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    setMenuState(false);

                }
            );

        });


        /*
         * მენიუს გარეთ დაჭერისას დახურვა
         */

        document.addEventListener(
            "click",
            (event) => {

                const clickedInsideMenu =
                    mobileMenu.contains(
                        event.target
                    );

                const clickedToggle =
                    menuToggle.contains(
                        event.target
                    );

                if (
                    !clickedInsideMenu &&
                    !clickedToggle
                ) {

                    setMenuState(false);

                }

            }
        );


        /*
         * ESCAPE → დახურვა
         */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    mobileMenu.classList.contains("open")
                ) {

                    setMenuState(false);

                    menuToggle.focus();

                }

            }
        );

    }


    /* =========================================================
       NAVIGATION MAP
    ========================================================= */

    const navigationMap = {

        "მთავარი":
            "index.html",

        "მოსაწვევები":
            "services.html",

        "ჩვენი ნამუშევრები":
            "portfolio.html",

        "პორტფოლიო":
            "portfolio.html",

        "ჩვენ შესახებ":
            "about.html",

        "კონტაქტი":
            "contact.html"

    };


    /*
     * ტექსტის გასუფთავება
     */

    const normalizeText = (text) => {

        return text
            .trim()
            .replace(/\s+/g, " ");

    };


    /*
     * Navigation-ის href-ების ავტომატური გასწორება
     */

    allNavLinks.forEach(link => {

        const text =
            normalizeText(
                link.textContent
            );

        if (
            Object.prototype.hasOwnProperty.call(
                navigationMap,
                text
            )
        ) {

            link.setAttribute(
                "href",
                navigationMap[text]
            );

        }

    });


    /* =========================================================
       ACTIVE PAGE
    ========================================================= */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /*
     * თუ URL მთავარ root-ზეა:
     *
     * /
     * /folder/
     *
     * ჩაითვალოს index.html-ად
     */

    if (
        !currentPage ||
        currentPage === "/"
    ) {

        currentPage =
            "index.html";

    }


    /*
     * GitHub Pages / ზოგადი URL მხარდაჭერა
     */

    const cleanPageName = (href) => {

        if (!href) return "";

        try {

            const url =
                new URL(
                    href,
                    window.location.href
                );

            let page =
                url.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();

            if (!page) {

                page = "index.html";

            }

            return page;

        } catch {

            return href
                .split("/")
                .pop()
                .toLowerCase();

        }

    };


    /*
     * ყველა link-ის შემოწმება
     */

    allNavLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;


        /*
         * Anchor (#section)
         * და გარე URL-ები არ შევცვალოთ
         */

        if (
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("mailto:")
        ) {

            return;

        }


        const linkPage =
            cleanPageName(href);


        /*
         * Active class
         */

        if (
            linkPage === currentPage
        ) {

            link.classList.add(
                "active"
            );

            link.setAttribute(
                "aria-current",
                "page"
            );

        } else {

            link.classList.remove(
                "active"
            );

            link.removeAttribute(
                "aria-current"
            );

        }

    });


    /* =========================================================
       SMOOTH PAGE TRANSITION
    ========================================================= */

    /*
     * შიდა გვერდზე გადასვლისას
     * მცირე fade-out ეფექტი
     */

    const internalLinks =
        document.querySelectorAll(
            'a[href$=".html"]'
        );


    internalLinks.forEach(link => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute(
                        "href"
                    );

                if (!href) return;

                /*
                 * ახალი tab / Ctrl / Shift / Meta
                 * გამოყენებისას transition არ გავაკეთოთ
                 */

                if (
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.metaKey ||
                    event.button !== 0
                ) {

                    return;

                }

                /*
                 * თუ იგივე გვერდია,
                 * ჩვეულებრივ გადავიდეთ
                 */

                const targetPage =
                    cleanPageName(href);

                if (
                    targetPage === currentPage
                ) {

                    return;

                }


                /*
                 * Mobile menu-ის დახურვა
                 */

                if (
                    mobileMenu &&
                    menuToggle
                ) {

                    mobileMenu.classList.remove(
                        "open"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuToggle.setAttribute(
                        "aria-label",
                        "მენიუს გახსნა"
                    );

                    menuToggle.innerHTML =
                        "☰";

                    document.body.classList.remove(
                        "menu-open"
                    );

                }


                /*
                 * Fade-out
                 */

                document.body.classList.add(
                    "page-leaving"
                );


                /*
                 * მცირე დაყოვნება
                 */

                event.preventDefault();

                setTimeout(() => {

                    window.location.href =
                        href;

                }, 180);

            }
        );

    });


    /* =========================================================
       PAGE LOAD ANIMATION
    ========================================================= */

    requestAnimationFrame(() => {

        document.body.classList.add(
            "page-loaded"
        );

    });


    /* =========================================================
       ACTIVE LINK HOVER EFFECT
    ========================================================= */

    desktopLinks.forEach(link => {

        link.addEventListener(
            "mouseenter",
            () => {

                link.style.setProperty(
                    "--nav-hover",
                    "1"
                );

            }
        );

        link.addEventListener(
            "mouseleave",
            () => {

                link.style.setProperty(
                    "--nav-hover",
                    "0"
                );

            }
        );

    });


    /* =========================================================
       ACCESSIBILITY
    ========================================================= */

    if (menuToggle) {

        /*
         * თუ HTML-ში aria ატრიბუტები არ გაქვს,
         * JS ავტომატურად დაამატებს
         */

        if (
            !menuToggle.hasAttribute(
                "aria-expanded"
            )
        ) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        if (
            !menuToggle.hasAttribute(
                "aria-label"
            )
        ) {

            menuToggle.setAttribute(
                "aria-label",
                "მენიუს გახსნა"
            );

        }

    }


    /* =========================================================
       PREVENT BODY SCROLL WHEN MENU IS OPEN
    ========================================================= */

    /*
     * CSS-ში .menu-open-საც დავამატებთ.
     * Desktop-ზე გავლენას არ მოახდენს.
     */

});