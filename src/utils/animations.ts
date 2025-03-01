
import { useEffect } from "react";

export const useIntersectionObserver = (selector: string, options = {}) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, { ...defaultOptions, ...options });
    
    elements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });
    
    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [selector, options]);
};

export const useSequentialAnimation = (
  selector: string,
  animationClass: string,
  delay = 100,
  options = {}
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animationClass);
          }, index * delay);
          observer.unobserve(entry.target);
        }
      });
    }, { ...defaultOptions, ...options });
    
    elements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });
    
    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [selector, animationClass, delay, options]);
};
