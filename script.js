document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const allNavLinks = document.querySelectorAll(
        ".nav-menu a, .mobile-menu a"
    );

    const desktopLinks = document.querySelectorAll(
        ".nav-menu a"
    );


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const setMenuState = (open) => {

        if (!menuToggle || !mobileMenu) return;

        mobileMenu.classList.toggle("open", open);

        menuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuToggle.setAttribute(
            "aria-label",
            open ? "მენიუს დახურვა" : "მენიუს გახსნა"
        );

        menuToggle.textContent = open ? "✕" : "☰";

        document.body.classList.toggle(
            "menu-open",
            open
        );
    };


    if (menuToggle && mobileMenu) {

        setMenuState(false);


        /* გახსნა / დახურვა */

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                mobileMenu.classList.contains("open");

            setMenuState(!isOpen);
        });


        /* მენიუს ბმულზე დაჭერა */

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {
                    setMenuState(false);
                });

            });


        /* მენიუს გარეთ დაჭერა */

        document.addEventListener("click", (event) => {

            if (
                !mobileMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                setMenuState(false);
            }

        });


        /* ESC */

        document.addEventListener("keydown", (event) => {

            if (
                event.key === "Escape" &&
                mobileMenu.classList.contains("open")
            ) {

                setMenuState(false);
                menuToggle.focus();
            }

        });

    }


    /* =========================================================
       NAVIGATION MAP
    ========================================================= */

    const navigationMap = {

        "მთავარი": "index.html",

        "მოსაწვევები": "services.html",

        "ჩვენი ნამუშევრები": "portfolio.html",

        "პორტფოლიო": "portfolio.html",

        "ჩვენ შესახებ": "about.html",

        "კონტაქტი": "contact.html"

    };


    /* =========================================================
       TEXT NORMALIZER
    ========================================================= */

    const normalizeText = (text) => {

        return text
            .trim()
            .replace(/\s+/g, " ");

    };


    /* =========================================================
       FIX NAVIGATION LINKS
    ========================================================= */

    allNavLinks.forEach(link => {

        const text = normalizeText(
            link.textContent
        );

        if (
            Object.prototype.hasOwnProperty.call(
                navigationMap,
                text
            )
        ) {

            link.href = navigationMap[text];
        }

    });


    /* =========================================================
       CURRENT PAGE
    ========================================================= */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (!currentPage) {
        currentPage = "index.html";
    }


    /* =========================================================
       GET PAGE NAME
    ========================================================= */

    const getPageName = (href) => {

        if (!href) return "";

        try {

            const url = new URL(
                href,
                window.location.href
            );

            const pathname = url.pathname;

            const page =
                pathname
                    .split("/")
                    .pop()
                    .toLowerCase();

            return page || "index.html";

        } catch {

            return href
                .split("/")
                .pop()
                .toLowerCase();

        }

    };


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    allNavLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        if (
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("mailto:")
        ) {
            return;
        }

        const linkPage =
            getPageName(href);

        const isActive =
            linkPage === currentPage;

        link.classList.toggle(
            "active",
            isActive
        );

        if (isActive) {

            link.setAttribute(
                "aria-current",
                "page"
            );

        } else {

            link.removeAttribute(
                "aria-current"
            );

        }

    });


    /* =========================================================
       PAGE TRANSITION
    ========================================================= */

    const internalLinks =
        document.querySelectorAll(
            'a[href$=".html"]'
        );


    internalLinks.forEach(link => {

        link.addEventListener("click", (event) => {

            const href =
                link.getAttribute("href");

            if (!href) return;


            /* ახალი tab / Ctrl / Shift / CMD */

            if (
                event.ctrlKey ||
                event.shiftKey ||
                event.metaKey ||
                event.button !== 0
            ) {
                return;
            }


            const targetPage =
                getPageName(href);


            /* იგივე გვერდი */

            if (
                targetPage === currentPage
            ) {
                return;
            }


            /* მობილური მენიუს დახურვა */

            setMenuState(false);


            /* Fade */

            document.body.classList.add(
                "page-leaving"
            );

            event.preventDefault();


            setTimeout(() => {

                window.location.href =
                    href;

            }, 180);

        });

    });


    /* =========================================================
       PAGE LOAD
    ========================================================= */

    requestAnimationFrame(() => {

        document.body.classList.add(
            "page-loaded"
        );

    });


    /* =========================================================
       DESKTOP NAV HOVER
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
       PRICE CARD INTERACTION
       თუ HTML-ში .package-card დაემატება,
       პრემიუმ/სტანდარტის არჩევა იმუშავებს.
    ========================================================= */

    const packageCards =
        document.querySelectorAll(
            ".package-card"
        );


    packageCards.forEach(card => {

        const buttons =
            card.querySelectorAll(
                "[data-package]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                    button.classList.add(
                        "selected"
                    );

                }
            );

        });

    });

});