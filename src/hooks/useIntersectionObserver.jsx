import { useEffect, useState, useRef } from "react";

export function useIntersectionObserver(placeholderSrc, fullSrc) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImgSrc(fullSrc);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [imgRef, fullSrc]);

  return [imgSrc, imgRef];
}
