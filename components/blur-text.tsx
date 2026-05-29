import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
}

export default function BlurText({ text, className = "" }: BlurTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio >= 0.1) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        rowGap: "0.1em",
      }}
      className={className}
    >
      {words.map((word, i) => {
        const delay = (i * 80) / 1000; // optimized stagger delay in seconds

        return (
          <motion.span
            key={i}
            initial={{ 
              filter: "blur(12px)", 
              opacity: 0, 
              y: 60,
              backdropFilter: "blur(0px)"
            }}
            animate={
              isInView
                ? {
                    filter: ["blur(12px)", "blur(6px)", "blur(0px)"],
                    opacity: [0, 0.7, 1],
                    y: [60, -8, 0],
                    backdropFilter: ["blur(0px)", "blur(4px)", "blur(8px)"]
                  }
                : { 
                    filter: "blur(12px)", 
                    opacity: 0, 
                    y: 60,
                    backdropFilter: "blur(0px)"
                  }
            }
            transition={{
              duration: 0.9,
              times: [0, 0.4, 1],
              ease: [0.25, 0.46, 0.45, 0.94], // custom easing curve
              delay: delay,
            }}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              background: "rgba(255, 255, 255, 0.08)",
              WebkitBackdropFilter: "blur(12px)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255, 255, 255, 0.25)",
              padding: "0.3em 0.5em",
              borderRadius: "0.5em",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "pointer",
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}
            whileHover={{
              background: "rgba(167, 25, 48, 0.22)",
              border: "1.5px solid rgba(167, 25, 48, 0.55)",
              boxShadow: "0 12px 48px rgba(167, 25, 48, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 0 20px rgba(167, 25, 48, 0.2)",
              scale: 1.08,
              y: -4,
            }}
            whileTap={{
              scale: 0.96,
              y: 0,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
