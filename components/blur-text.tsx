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
              background: "rgba(255, 255, 255, 0.06)",
              WebkitBackdropFilter: "blur(8px)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "0.2em 0.4em",
              borderRadius: "0.4em",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
            }}
            whileHover={{
              background: "rgba(167, 25, 48, 0.15)",
              border: "1px solid rgba(167, 25, 48, 0.4)",
              boxShadow: "0 6px 20px rgba(167, 25, 48, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
              scale: 1.05,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
