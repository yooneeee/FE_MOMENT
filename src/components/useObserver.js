import { useEffect } from "react";

export const useObserver = ({
  target,
  root = null,
  rootMargin = "0px",
  threshold = 1.0,
  onIntersect,
}) => {
  useEffect(() => {
    let observer;

    if (target && target.current) {
      observer = new IntersectionObserver(onIntersect, {
        root,
        rootMargin,
        threshold,
      });
      observer.observe(target.current);
    }
    return () => observer && observer.disconnect();
  }, [target, rootMargin, threshold]);
};
