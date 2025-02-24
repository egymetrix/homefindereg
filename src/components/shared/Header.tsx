/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Briefcase,
  House,
  UserRoundSearch,
  UserRoundCheck,
  Menu,
  X,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
// import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import Input from "../ui/input";
import { clientPost, clientGetUser } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth";
import { cookies } from "@/lib/cookies";

const Header = ({
  withBg = false,
  withShadow = false,
}: {
  withBg?: boolean;
  withShadow?: boolean;
}) => {
  const { user, logout } = useAuthContext();
  const t = useTranslations("home.navLinks");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogState, setDialogState] = useState<"signIn" | "signUp" | null>(
    null
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    {
      href: "/",
      label: "realEstate",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      href: "/about",
      label: "selling",
      icon: <House className="w-4 h-4" />,
    },
    {
      href: "/services",
      label: "searching",
      icon: <UserRoundSearch className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDialogOpen = (state: "signIn" | "signUp") => {
    setDialogState(state);
    setIsMenuOpen(false);
  };

  const handleDialogClose = () => {
    setDialogState(null);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const renderAuthButton = (hasBg: boolean) => {
    if (user) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${
              hasBg ? "text-gray-900" : "text-white"
            }`}
          >
            <UserRoundCheck
              className={`${hasBg ? "text-primary" : "text-white"} size-4`}
            />
            {user.name}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/profile"
                className={`w-full flex items-center gap-2  text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                  hasBg ? "text-gray-900" : "text-white"
                }`}
                onClick={() => setShowProfileMenu(false)}
              >
                <UserRoundCheck
                  className={`${hasBg ? "text-primary" : "text-white"} size-4`}
                />
                {t("profile")}
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2  text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                  hasBg ? "text-gray-900" : "text-white"
                }`}
              >
                <LogOut
                  className={`${hasBg ? "text-primary" : "text-white"} size-4`}
                />
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => handleDialogOpen("signIn")}
        className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${
          hasBg ? "text-gray-900" : "text-white"
        }`}
      >
        <UserRoundCheck
          className={`${hasBg ? "text-primary" : "text-white"} size-4`}
        />
        {t("signIn")}
      </button>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 w-full z-[99997] transition-all duration-300 ${
          withBg || isScrolled
            ? "bg-white text-gray-900"
            : "bg-transparent backdrop-blur-sm text-white"
        } ${withShadow ? "shadow-md" : ""}`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-screen-xl">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={140}
              height={140}
              className={withBg || isScrolled ? "" : "brightness-0 invert"}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-4">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href ?? ""}
                    className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${
                      withBg || isScrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    <span
                      className={`${
                        withBg || isScrolled ? "text-primary" : "text-white"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li className="flex gap-4">
                {renderAuthButton(withBg || isScrolled)}
              </li>
            </ul>
            <Suspense
              fallback={
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              {/* <LanguageSwitcher bgColor={withBg || isScrolled} /> */}
            </Suspense>
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center gap-4">
            <Suspense
              fallback={
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              {/* <LanguageSwitcher bgColor={withBg || isScrolled} /> */}
            </Suspense>
            <button
              className={withBg || isScrolled ? "text-gray-900" : "text-white"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <nav
            className={`lg:hidden fixed inset-x-0 top-[72px] bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out z-[99996] ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href ?? ""}
                    className={`text-black text-sm hover:text-gray-300 flex items-center gap-2 transition-colors ${
                      withBg || isScrolled ? "text-gray-900" : "text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span
                      className={`${
                        withBg || isScrolled ? "text-primary" : "text-white"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li className="flex flex-col items-center gap-4">
                {renderAuthButton(withBg || isScrolled)}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <Dialog open={dialogState !== null} onOpenChange={handleDialogClose}>
        <DialogContent className="text-center z-[99999] p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-700 mb-4">
              {t("formTitle")}
            </DialogTitle>
          </DialogHeader>
          {dialogState === "signIn" ? (
            <SignInForm setDialogState={setDialogState} />
          ) : (
            <SignUpForm setDialogState={setDialogState} />
          )}
          <p className="text-center text-sm text-gray-500 mt-4">
            {dialogState === "signIn"
              ? t("dontHaveAnAccount")
              : t("alreadyHaveAnAccount")}
            <button
              onClick={() =>
                handleDialogOpen(dialogState === "signIn" ? "signUp" : "signIn")
              }
              className="text-primary hover:underline ml-1"
            >
              {dialogState === "signIn" ? t("signUp") : t("signIn")}
            </button>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SignInForm = ({
  setDialogState,
}: {
  setDialogState: React.Dispatch<
    React.SetStateAction<"signIn" | "signUp" | null>
  >;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTranslations("home.navLinks");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthContext();

  const { mutate, isPending } = useMutation<AuthResponse, Error, FormData>({
    mutationKey: ["signIn"],
    mutationFn: (formData: FormData) =>
      clientPost("/site/login", formData, locale),
    onSuccess: async (response) => {
      if (response.token) {
        cookies.set("token", response.token, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // Get user data using token
        const userData = await clientGetUser(response.token, locale);
        login({ ...response, user: userData.user });
        toast.success(response.message || "Successfully logged in!");
        setDialogState(null);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login failed");
    },
  });

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

      const data = event.data;
      if (data.type === "googleAuth" && data.token) {
        cookies.set("token", data.token, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        const userData = await clientGetUser(data.token, locale);
        login({ token: data.token, user: userData.user });
        toast.success(data.message || "Successfully logged in!");
        setDialogState(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [locale, login, setDialogState]);

  const handleSignIn = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <a
          onClick={() => {
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/site/auth/facebook`,
              "Facebook Sign In",
              `width=${width},height=${height},left=${left},top=${top}`
            );
          }}
          className="flex items-center text-sm bg-blue-500 text-white justify-center gap-2 w-full rounded-full py-2.5 transition-all duration-300 hover:shadow-[0_8px_16px_0_rgba(59,130,246,0.3)] active:scale-[0.98] transform"
        >
          <Image
            src="/images/facebook-logo.svg"
            alt="Facebook"
            width={20}
            height={20}
          />
          Facebook
        </a>
        <a
          onClick={() => {
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/site/auth/google`,
              "Google Sign In",
              `width=${width},height=${height},left=${left},top=${top}`
            );
          }}
          className="flex items-center text-sm justify-center gap-2 w-full rounded-full py-2.5 border transition-all duration-300 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.1)] hover:bg-gray-50 active:scale-[0.98] transform"
        >
          <Image src="/images/google.svg" alt="Google" width={20} height={20} />
          Google
        </a>
        <button className="flex items-center text-sm bg-[#1a1f24] text-white justify-center gap-2 w-full rounded-full py-2.5 transition-all duration-300 hover:shadow-[0_8px_16px_0_rgba(26,31,36,0.25)] active:scale-[0.98] transform">
          <Image
            src="/images/apple-logo.svg"
            alt="Apple"
            width={20}
            height={20}
          />
          Apple
        </button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            label={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <Input
            type={showPassword ? "text" : "password"}
            label={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute  top-1/2 -translate-y-1/2 ${
              showPassword ? "text-primary" : "text-gray-500"
            } ${locale === "en" ? "right-3" : "left-3"}`}
          >
            {showPassword ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <Button className="w-full" onClick={handleSignIn} disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("signIn")}
      </Button>
    </div>
  );
};

const SignUpForm = ({
  setDialogState,
}: {
  setDialogState: React.Dispatch<
    React.SetStateAction<"signIn" | "signUp" | null>
  >;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("home.navLinks");
  const locale = useLocale();
  const { login } = useAuthContext();

  const { mutate, isPending } = useMutation<AuthResponse, Error, FormData>({
    mutationKey: ["signUp"],
    mutationFn: (formData: FormData) =>
      clientPost("/site/register", formData, locale),
    onSuccess: async (response) => {
      if (response.token) {
        cookies.set("token", response.token, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        const userData = await clientGetUser(response.token, locale);
        login({ ...response, user: userData.user });
        toast.success(response.message || "Successfully registered!");
        setDialogState(null);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Registration failed");
    },
  });

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);
    mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            label={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            label={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="tel"
            label={t("phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <Input
            type={showPassword ? "text" : "password"}
            label={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 ${
              showPassword ? "text-primary" : "text-gray-500"
            } ${locale === "en" ? "right-3" : "left-3"}`}
          >
            {showPassword ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-2 relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute top-1/2 -translate-y-1/2 ${
              showConfirmPassword ? "text-primary" : "text-gray-500"
            } ${locale === "en" ? "right-3" : "left-3"}`}
          >
            {showConfirmPassword ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <Button className="w-full" onClick={handleSignUp} disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("signUp")}
      </Button>
    </div>
  );
};

export default Header;
