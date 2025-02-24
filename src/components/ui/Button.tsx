import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success";
  size?: "default" | "sm" | "lg";
}

const Button = ({
  children,
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "relative overflow-hidden font-medium rounded-full transition-all duration-700 ease-in-out tracking-[0.05rem]";

  const sizeStyles = {
    sm: "px-6 py-2.5 text-xs",
    default: "px-9 py-3.5 text-sm",
    lg: "px-12 py-4 text-base",
  };

  const variantStyles = {
    primary: `
      bg-[length:300%_auto] 
      bg-gradient-to-r from-primary via-black/70 to-primary 
      bg-[position:0%_0%] 
      hover:bg-[position:100%_0%] 
      shadow-[0_8px_16px_0_rgba(59,130,246,0.18)]
      hover:shadow-[0_9px_9px_0_rgba(59,130,246,0.21),0_21px_13px_0_rgba(59,130,246,0.13)]
      active:scale-[0.98]
      text-white
    `,
    secondary: `
      bg-slate-700
      hover:bg-slate-800
      shadow-md
      hover:shadow-lg
      active:scale-[0.98]
      text-white
    `,
    success: `
      bg-[length:300%_auto] 
      bg-gradient-to-r from-green-600 via-teal-600 to-green-600
      bg-[position:0%_0%] 
      hover:bg-[position:100%_0%] 
      shadow-[0_8px_16px_0_rgba(22,163,74,0.18)]
      hover:shadow-[0_9px_9px_0_rgba(22,163,74,0.21),0_21px_13px_0_rgba(22,163,74,0.13)]
      active:scale-[0.98]
      text-white
    `,
  };

  const contentStyles = `
    relative 
    z-10 
    inline-flex 
    items-center 
    justify-center 
    overflow-hidden 
    transition-transform 
    duration-300 
    ease-in-out 
    active:translate-x-1
    gap-2
  `;

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[position:0%_0%] disabled:hover:shadow-none",
        className
      )}
      {...props}
    >
      <span className={contentStyles}>{children}</span>
    </button>
  );
};

export default Button;
