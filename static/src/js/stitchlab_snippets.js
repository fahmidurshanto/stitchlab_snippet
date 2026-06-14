/** @odoo-module **/

function connectFeatureHub(section) {
    const svg = section.querySelector(".sl_svg_pipelines");
    const container = section.querySelector(".sl_hub_relative_container");
    const centerNode = section.querySelector("[data-center-node]");

    if (!svg || !container || !centerNode || window.getComputedStyle(svg).display === "none") {
        return;
    }

    const svgRect = svg.getBoundingClientRect();
    const centerRect = centerNode.getBoundingClientRect();
    const cx = centerRect.left + centerRect.width / 2 - svgRect.left;
    const cy = centerRect.top + centerRect.height / 2 - svgRect.top;

    if (svgRect.width <= 0 || svgRect.height <= 0 || Number.isNaN(cx) || Number.isNaN(cy)) {
        return;
    }

    ["1", "2", "3", "4", "5", "8"].forEach((id) => {
        const card = section.querySelector(`[data-feature="${id}"]`);
        const pipe = section.querySelector(`[data-pipe="${id}"]`);
        const anim = section.querySelector(`[data-anim="${id}"]`);

        if (!card || !pipe) {
            return;
        }

        const cardRect = card.getBoundingClientRect();
        const ey = cardRect.top + cardRect.height / 2 - svgRect.top;
        const ex = Number(id) <= 3 ? cardRect.right - svgRect.left : cardRect.left - svgRect.left;
        const controlX = (ex + cx) / 2;
        const pathData = `M ${ex} ${ey} Q ${controlX} ${ey} ${cx} ${cy}`;

        pipe.setAttribute("d", pathData);
        if (anim) {
            anim.setAttribute("path", pathData);
        }
    });
}

function initFeatureHubs(root = document) {
    root.querySelectorAll(".s_stitchlab_features_hub").forEach((section) => {
        if (section.dataset.slHubReady) {
            return;
        }
        section.dataset.slHubReady = "1";

        const update = () => window.requestAnimationFrame(() => connectFeatureHub(section));
        const observer = new ResizeObserver(update);
        const container = section.querySelector(".sl_hub_relative_container");
        const centerNode = section.querySelector("[data-center-node]");

        if (container) {
            observer.observe(container);
        }
        if (centerNode) {
            observer.observe(centerNode);
        }

        window.addEventListener("resize", update);
        window.addEventListener("load", update, { once: true });
        update();
        setTimeout(update, 250);
        setTimeout(update, 700);
    });
}

function initReviewCarousels(root = document) {
    root.querySelectorAll(".s_stitchlab_reviews").forEach((section) => {
        if (section.dataset.slCarouselReady) {
            return;
        }
        section.dataset.slCarouselReady = "1";

        const track = section.querySelector(".sl_carousel_track");
        const slides = [...section.querySelectorAll(".sl_review_slide")];
        const dotsContainer = section.querySelector(".sl_carousel_dots");
        const prevBtn = section.querySelector(".sl_prev");
        const nextBtn = section.querySelector(".sl_next");

        if (!track || !slides.length || !dotsContainer || !prevBtn || !nextBtn) {
            return;
        }

        let currentIndex = 0;
        let autoPlayInterval;

        dotsContainer.innerHTML = "";
        const dots = slides.map((slide, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Show review ${index + 1}`);
            dotsContainer.appendChild(dot);
            return dot;
        });

        const updateCarousel = (index) => {
            currentIndex = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
        };

        const nextSlide = () => updateCarousel((currentIndex + 1) % slides.length);
        const prevSlide = () => updateCarousel((currentIndex - 1 + slides.length) % slides.length);
        const stopAutoPlay = () => clearInterval(autoPlayInterval);
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4500);
        };

        nextBtn.addEventListener("click", () => {
            nextSlide();
            startAutoPlay();
        });
        prevBtn.addEventListener("click", () => {
            prevSlide();
            startAutoPlay();
        });
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                updateCarousel(index);
                startAutoPlay();
            });
        });

        const container = section.querySelector(".sl_carousel_container");
        if (container) {
            container.addEventListener("mouseenter", stopAutoPlay);
            container.addEventListener("mouseleave", startAutoPlay);
        }

        updateCarousel(0);
        startAutoPlay();
    });
}

function initLineArtAnimation(root = document) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const canvas = entry.target.querySelector('.sl_la_canvas') || (entry.target.classList.contains('sl_la_canvas') ? entry.target : null);
                if (canvas) {
                    canvas.classList.add('is-visible');
                }
            }
        });
    }, observerOptions);

    // Setup for tabbed line art section
    root.querySelectorAll('.s_stitchlab_line_art').forEach((section) => {
        if (section.dataset.slLineArtReady) {
            return;
        }
        section.dataset.slLineArtReady = "1";
        observer.observe(section);

        const tabs = section.querySelectorAll('.sl_la_tab');
        const svgs = section.querySelectorAll('.sl_la_svg');
        const canvas = section.querySelector('.sl_la_canvas');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                svgs.forEach(svg => {
                    svg.style.display = 'none';
                    svg.classList.remove('active');
                });
                
                const activeSvg = section.querySelector(`.sl_la_svg[data-garment="${target}"]`);
                if (activeSvg) {
                    activeSvg.style.display = 'block';
                    activeSvg.classList.add('active');
                }

                if (canvas) {
                    canvas.classList.remove('is-visible');
                    void canvas.offsetWidth; // Force reflow
                    canvas.classList.add('is-visible');
                }
            });
        });
    });

    // Setup for stacked line art cards
    root.querySelectorAll('.s_stitchlab_line_art_cards .sl_process_card').forEach((card) => {
        if (card.dataset.slLineArtReady) {
            return;
        }
        card.dataset.slLineArtReady = "1";
        observer.observe(card);
    });
}

function initStitchLabSnippets(root = document) {
    initFeatureHubs(root);
    initReviewCarousels(root);
    initLineArtAnimation(root);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initStitchLabSnippets());
} else {
    initStitchLabSnippets();
}
