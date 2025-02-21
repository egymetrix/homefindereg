import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "primary" | "secondary";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, variant = "primary", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const locale = useLocale();
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer w-full rounded-lg bg-gray-100 px-4 pt-5 pb-2 text-gray-900 transition-all duration-300 focus:bg-white focus:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] outline-none ring-0",
            {
              "border border-gray-200 focus:border-blue-500":
                variant === "primary",
              "border-0": variant === "secondary",
            },
            className
          )}
          ref={ref}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value !== "");
          }}
          onChange={(e) => setHasValue(e.target.value !== "")}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute text-gray-500 transition-all duration-300 cursor-text select-none pointer-events-none",
              {
                "text-[12px] top-[5px]": isFocused || hasValue,
                "peer-focus:text-blue-500": variant === "primary",
                "text-[15px] top-[14px]": !isFocused && !hasValue,
              },
              locale === "en" ? "left-4" : "right-4"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
