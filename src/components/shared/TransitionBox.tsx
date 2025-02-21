"use client";
import { cn } from "@/lib/utils";
import { useInView, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
export type transitionType =
  | "fromBottom"
  | "fromRight"
  | "fromLeft"
  | "fromTop"
  | "scale";
interface TransitionBoxProps {
  className?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  transitionType?: transitionType;
  delay?: number;
  duration?: number;
  fromValue?: string;
  style?: React.CSSProperties;
  overRide?: boolean;
  overRideValue?: boolean;
  setValue?: (value: boolean) => void;
}

const TransitionBox: React.FC<TransitionBoxProps> = ({
  className,
  children,
  containerClassName,
  transitionType = "fromBottom",
  delay = 0,
  duration = 0.5,
  fromValue = "110%",
  style,
  overRide,
  overRideValue,
  setValue,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const inView = useInView(ref);
  useEffect(() => {
    if (setValue) {
      setValue(inView);
    }
  }, [inView, setValue]);
  const getInitialPosition = () => {
    switch (transitionType) {
      case "scale":
        return { scale: 0.01 };
      case "fromBottom":
        return { y: fromValue, x: "0%" };
      case "fromTop":
        return { y: `-${fromValue}`, x: "0%" };
      case "fromRight":
        return locale === "ar"
          ? { x: fromValue, y: "0%" }
          : { x: `-${fromValue}`, y: "0%" };
      case "fromLeft":
        return locale === "ar"
          ? { x: `-${fromValue}`, y: "0%" }
          : { x: fromValue, y: "0%" };
      default:
        return { x: "0%", y: "0%" };
    }
  };

  const initialPosition = getInitialPosition();
  if (overRide)
    return (
      <div ref={ref} className={cn("overflow-hidden", containerClassName)}>
        <motion.div
          animate={{
            x: overRideValue ? "0%" : initialPosition.x,
            y: overRideValue ? "0%" : initialPosition.y,
            scale: overRideValue ? 1 : initialPosition.scale || 1,
          }}
          style={{ ...initialPosition, ...style }}
          transition={{
            duration,
            delay,
            ease: "easeInOut",
          }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      </div>
    );
  return (
    <div ref={ref} className={cn("overflow-hidden", containerClassName)}>
      <motion.div
        animate={{
          x: inView ? "0%" : initialPosition.x,
          y: inView ? "0%" : initialPosition.y,
          scale: inView ? 1 : initialPosition.scale || 1,
        }}
        style={{ ...initialPosition, ...style }}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default TransitionBox;
