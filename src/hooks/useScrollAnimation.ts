import { useEffect, useRef } from "react";

export function useScrollAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      const elements = ref.current.querySelectorAll(".scroll-reveal");
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
}
