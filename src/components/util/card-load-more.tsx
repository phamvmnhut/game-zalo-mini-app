import React from "react";
import { useEffect, useRef } from "react";

export function CardLoadMore({
  children,
  isLast,
  newLimit,
}: {
  isLast: boolean;
  newLimit: Function;
  children: React.ReactNode;
}) {
  /**
   * Select the Card component with useRef
   */
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Implement Intersection Observer to check if the last Card in the array is visible on the screen, then set a new limit
   */
  useEffect(() => {
    if (!cardRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        newLimit();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(cardRef.current);
  }, [isLast]);

  return <div ref={cardRef}>{children}</div>;
}
