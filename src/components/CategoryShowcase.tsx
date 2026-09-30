"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

export type CategoryShowcaseItem = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
};

type Props = {
  categories: CategoryShowcaseItem[];
};

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
    </svg>
  );
}

function CategoryCard({
  category,
  index,
  total,
  mobile = false,
}: {
  category: CategoryShowcaseItem;
  index: number;
  total: number;
  mobile?: boolean;
}) {
  return (
    <a
      href={`/shop?category=${encodeURIComponent(category.slug)}`}
      className={`zelora-category-showcase-card${mobile ? " is-mobile" : ""}`}
      aria-label={`Explore ${category.name}`}
    >
      <div className="zelora-category-showcase-media">
        {category.image ? (
          <img src={category.image} alt={category.name} loading="lazy" />
        ) : (
          <div className="zelora-category-showcase-fallback" />
        )}
      </div>

      <div className="zelora-category-showcase-vignette" />
      <div className="zelora-category-showcase-sheen" />
      <div className="zelora-category-showcase-frame" />

      <div className="zelora-category-showcase-index">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <div className="zelora-category-showcase-info">
        <div className="zelora-category-showcase-name-row">
          <h3>{category.name}</h3>
          <span className="zelora-category-showcase-arrow">
            <ArrowIcon />
          </span>
        </div>
        <span className="zelora-category-showcase-cta">Explore collection</span>
      </div>
    </a>
  );
}

export default function CategoryShowcase({ categories }: Props) {
  const [current, setCurrent] = useState(categories.length > 1 ? 1 : 0);
  const [transition, setTransition] = useState(true);
  const pointerStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const autoplayTimer = useRef<number | null>(null);

  const mobileSlides = useMemo(() => {
    if (categories.length <= 1) return categories;
    return [categories[categories.length - 1], ...categories, categories[0]];
  }, [categories]);

  useEffect(() => {
    setCurrent(categories.length > 1 ? 1 : 0);
    setTransition(true);
  }, [categories.length]);

  useEffect(() => {
    if (categories.length <= 1) return;

    const scheduleAutoplay = () => {
      if (autoplayTimer.current !== null) {
        window.clearTimeout(autoplayTimer.current);
      }

      autoplayTimer.current = window.setTimeout(() => {
        setCurrent((value) => value + 1);
        scheduleAutoplay();
      }, 4800);
    };

    scheduleAutoplay();

    return () => {
      if (autoplayTimer.current !== null) {
        window.clearTimeout(autoplayTimer.current);
      }
    };
  }, [categories.length]);

  useEffect(() => {
    if (transition) return;

    const frame = window.requestAnimationFrame(() => {
      setTransition(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [transition]);

  if (!categories.length) return null;

  const restartAutoplay = () => {
    if (categories.length <= 1) return;

    if (autoplayTimer.current !== null) {
      window.clearTimeout(autoplayTimer.current);
    }

    autoplayTimer.current = window.setTimeout(() => {
      setCurrent((value) => value + 1);
      restartAutoplay();
    }, 4800);
  };

  const goPrevious = () => {
    if (categories.length <= 1) return;
    setTransition(true);
    setCurrent((value) => value - 1);
    restartAutoplay();
  };

  const goNext = () => {
    if (categories.length <= 1) return;
    setTransition(true);
    setCurrent((value) => value + 1);
    restartAutoplay();
  };

  const handleTransitionEnd = () => {
    if (categories.length <= 1) return;

    if (current === 0) {
      setTransition(false);
      setCurrent(categories.length);
    } else if (current === categories.length + 1) {
      setTransition(false);
      setCurrent(1);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    dragged.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    if (Math.abs(event.clientX - pointerStart.current) > 8) {
      dragged.current = true;
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;

    const delta = event.clientX - pointerStart.current;
    pointerStart.current = null;

    if (Math.abs(delta) > 45) {
      if (delta < 0) goNext();
      else goPrevious();
    }
  };

  return (
    <>
      <div
        className="zelora-category-showcase-desktop"
        style={{ "--category-count": categories.length } as CSSProperties}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            total={categories.length}
          />
        ))}
      </div>

      <div className="zelora-category-showcase-mobile">
        <div className="zelora-category-showcase-controls">
          <span>
            {categories.length > 1 ? "SWIPE TO DISCOVER" : "DISCOVER THE COLLECTION"}
          </span>

          {categories.length > 1 && (
            <div className="zelora-category-showcase-arrows">
              <button type="button" onClick={goPrevious} aria-label="Previous category">
                <ChevronIcon direction="left" />
              </button>
              <button type="button" onClick={goNext} aria-label="Next category">
                <ChevronIcon direction="right" />
              </button>
            </div>
          )}
        </div>

        <div
          className="zelora-category-showcase-viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
            dragged.current = false;
          }}
          onLostPointerCapture={() => {
            pointerStart.current = null;
            dragged.current = false;
          }}
          onClickCapture={(event) => {
            if (dragged.current) {
              event.preventDefault();
              event.stopPropagation();
              dragged.current = false;
            }
          }}
        >
          <div
            className="zelora-category-showcase-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(calc(-${current} * var(--category-slide-step)), 0, 0)`,
              transition: transition
                ? "transform 900ms cubic-bezier(.16,1,.3,1)"
                : "none",
            }}
          >
            {mobileSlides.map((category, index) => {
              const displayIndex =
                categories.length > 1
                  ? (index - 1 + categories.length) % categories.length
                  : 0;

              return (
                <div
                  className={`zelora-category-showcase-slide${
                    displayIndexFor(current, categories.length) === displayIndex
                      ? " is-active"
                      : ""
                  }`}
                  key={`${category.id}-${index}`}
                >
                  <CategoryCard
                    category={category}
                    index={displayIndex}
                    total={categories.length}
                    mobile
                  />
                </div>
              );
            })}
          </div>
        </div>

        {categories.length > 1 && (
          <div className="zelora-category-showcase-progress" aria-hidden="true">
            {categories.map((category, index) => {
              const active = displayIndexFor(current, categories.length) === index;
              return <span key={category.id} className={active ? "active" : ""} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}

function displayIndexFor(current: number, length: number) {
  if (length <= 1) return 0;
  return (current - 1 + length) % length;
}
