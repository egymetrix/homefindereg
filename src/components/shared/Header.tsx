/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  UserRoundCheck,
  Menu,
  X,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Home,
  Info,
  Building,
  PhoneCall,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import Input from "../ui/input";
import { clientPost, clientGetUser } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth";
import { cookies } from "@/lib/cookies";
import LanguageSwitcher from "./LanguageSwitcher";

declare global {
  interface Window {
    googleAuthWindow?: WindowProxy | null;
    facebookAuthWindow?: WindowProxy | null;
    authDebug?: {
      lastResponse?: any;
      lastError?: any;
      authHistory: Array<{
        provider: string;
        timestamp: string;
        type: string;
        data: any;
      }>;
    };
  }
}

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
      label: "home",
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: "/about",
      label: "about",
      icon: <Info className="w-4 h-4" />,
    },
    {
      href: "/sell-property",
      label: "sellProperty",
      icon: <Building className="w-4 h-4" />,
    },
    {
      href: "/contact",
      label: "contact",
      icon: <PhoneCall className="w-4 h-4" />,
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
            className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${hasBg ? "text-gray-900" : "text-white"
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
                className={`w-full flex items-center gap-2  text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors`}
                onClick={() => setShowProfileMenu(false)}
              >
                <UserRoundCheck className={`size-4`} />
                {t("profile")}
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2  text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors`}
              >
                <LogOut className={`size-4`} />
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
        className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${hasBg ? "text-gray-900" : "text-white"
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
        className={`sticky top-0 left-0 right-0 w-full z-[99997] transition-all duration-300 ${withBg || isScrolled
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
            <div className="flex gap-10">
              {navLinks.slice(0, 5).map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href ?? ""}
                    className={`text-sm hover:opacity-75 flex items-center gap-2 transition-colors ${withBg || isScrolled ? "text-gray-900" : "text-white"
                      }`}
                  >
                    <span
                      className={`${withBg || isScrolled ? "text-primary" : "text-white"
                        }`}
                    >
                      {link.icon}
                    </span>
                    {t(link.label)}
                  </Link>
                </div>
              ))}
              <div className="flex gap-4">
                {renderAuthButton(withBg || isScrolled)}
              </div>
            </div>
            <Suspense
              fallback={
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              <LanguageSwitcher bgColor={withBg || isScrolled} />
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
              <LanguageSwitcher bgColor={withBg || isScrolled} />
            </Suspense>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <nav
            className={`lg:hidden fixed inset-x-0 top-[72px] bg-white backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out z-[99996] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href ?? ""}
                    className="text-gray-900 text-sm hover:text-gray-600 flex items-center gap-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-primary">{link.icon}</span>
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li className="flex flex-col items-center gap-4">
                {user ? (
                  <div className="flex flex-col items-center gap-2">
                    <Link
                      href="/profile"
                      className="text-gray-900 text-sm hover:text-gray-600 flex items-center gap-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserRoundCheck className="text-primary size-4" />
                      {t("profile")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-900 text-sm hover:text-gray-600 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="text-primary size-4" />
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDialogOpen("signIn")}
                    className="text-gray-900 text-sm hover:text-gray-600 flex items-center gap-2 transition-colors"
                  >
                    <UserRoundCheck className="text-primary size-4" />
                    {t("signIn")}
                  </button>
                )}
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
              className="text-primary hover:underline mx-1"
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

  const openSocialAuthWindow = (provider: "google" | "facebook" | "apple") => {
    // Initialize debug object if not exists
    if (typeof window !== "undefined" && !window.authDebug) {
      window.authDebug = {
        authHistory: [],
      };
    }

    // Log attempt to debug history
    window.authDebug!.authHistory.push({
      provider,
      timestamp: new Date().toISOString(),
      type: "windowOpen",
      data: { attempt: true },
    });

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    let url = "";
    let windowName = "";
    let windowRef = null;

    if (provider === "google") {
      // Use our API route which will handle the OAuth flow
      url = `${process.env.NEXT_PUBLIC_API_URL}/site/auth/google`;
      windowName = "Google Sign In";
      windowRef = window.open(
        url,
        windowName,
        `width=${width},height=${height},left=${left},top=${top}`
      );
      window.googleAuthWindow = windowRef;
    } else if (provider === "facebook") {
      url = `${process.env.NEXT_PUBLIC_API_URL}/site/auth/facebook`;
      windowName = "Facebook Sign In";
      windowRef = window.open(
        url,
        windowName,
        `width=${width},height=${height},left=${left},top=${top}`
      );
      window.facebookAuthWindow = windowRef;
    } else if (provider === "apple") {
      // Implement Apple sign in if available
    }

    // Log window open status
    window.authDebug!.authHistory.push({
      provider,
      timestamp: new Date().toISOString(),
      type: "windowOpenResult",
      data: {
        success: !!windowRef,
        windowClosed: windowRef ? windowRef.closed : true,
      },
    });
  };

  // Handle social authentication through popup windows
  useEffect(() => {
    // Initialize debug object
    if (typeof window !== "undefined" && !window.authDebug) {
      window.authDebug = {
        authHistory: [],
      };
    }

    const handleSocialAuth = async (
      data: any,
      windowRef?: WindowProxy | null
    ) => {
      try {
        // Log to debug object
        window.authDebug!.lastResponse = data;
        window.authDebug!.authHistory.push({
          provider: data.type === "googleAuth" ? "google" : "facebook",
          timestamp: new Date().toISOString(),
          type: "success",
          data: data,
        });

        cookies.set("token", data.token, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        const userData = await clientGetUser(data.token);

        // Log user data to debug object
        window.authDebug!.authHistory.push({
          provider: data.type === "googleAuth" ? "google" : "facebook",
          timestamp: new Date().toISOString(),
          type: "userData",
          data: userData,
        });

        if (!userData || !userData.user) {
          throw new Error("Failed to get user data");
        }

        login({ token: data.token, user: userData.user });
        toast.success(data.message || "Successfully logged in!");
        setDialogState(null);

        // Close the popup window if it's still open
        if (windowRef && !windowRef.closed) {
          windowRef.close();
        }
      } catch (error: any) {
        console.error("Authentication error details:", error);

        // Log error to debug object
        window.authDebug!.lastError = error;
        window.authDebug!.authHistory.push({
          provider: data.type === "googleAuth" ? "google" : "facebook",
          timestamp: new Date().toISOString(),
          type: "error",
          data: error,
        });

        toast.error(error?.message || "Authentication failed");
      }
    };

    const handleMessage = async (event: MessageEvent) => {
      // Check if it's our authentication message with token
      if (
        event.data &&
        (event.data === "authentication-successful" ||
          (typeof event.data === "object" &&
            event.data.type === "authentication-successful"))
      ) {
        // Log to debug object
        window.authDebug!.authHistory.push({
          provider: "google",
          timestamp: new Date().toISOString(),
          type: "message",
          data: event.data,
        });

        // Extract token either from message or from cookies
        let token;
        if (typeof event.data === "object" && event.data.token) {
          token = event.data.token;

          // Store token in cookie for future use
          cookies.set("token", token, {
            expires: 1, // 1 day
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        } else {
          token = cookies.get("token");
        }

        if (!token) {
          console.error("No token available after authentication");
          toast.error("Authentication failed: No token received");
          return;
        }

        // Fetch user data with token
        try {
          const userData = await clientGetUser(token);

          if (!userData || !userData.user) {
            throw new Error("Failed to get user data");
          }

          login({ token, user: userData.user });
          toast.success("Successfully logged in!");
          setDialogState(null);

          // Close the popup window if it's still open
          if (window.googleAuthWindow && !window.googleAuthWindow.closed) {
            window.googleAuthWindow.close();
          }
        } catch (error: any) {
          toast.error(error?.message || "Authentication failed");
        }

        return;
      }

      // Handle existing authentication flow for backward compatibility
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) {
        return;
      }

      const data = event.data;

      // Log all incoming messages to debug history
      if (window.authDebug) {
        window.authDebug.authHistory.push({
          provider:
            data.type === "googleAuth"
              ? "google"
              : data.type === "facebookAuth"
                ? "facebook"
                : "unknown",
          timestamp: new Date().toISOString(),
          type: "message",
          data: data,
        });
      }

      // Handle Google Auth
      if (data.type === "googleAuth") {
        if (data.token) {
          await handleSocialAuth(data, window.googleAuthWindow);
        } else if (data.error) {
          // Log error to debug object
          window.authDebug!.lastError = data.error;
          window.authDebug!.authHistory.push({
            provider: "google",
            timestamp: new Date().toISOString(),
            type: "errorResponse",
            data: data.error,
          });

          toast.error(data.error || "Google authentication failed");
        }
      }

      // Handle Facebook Auth
      else if (data.type === "facebookAuth") {
        if (data.token) {
          await handleSocialAuth(data, window.facebookAuthWindow);
        } else if (data.error) {
          console.error("Facebook auth error response:", data.error);

          // Log error to debug object
          window.authDebug!.lastError = data.error;
          window.authDebug!.authHistory.push({
            provider: "facebook",
            timestamp: new Date().toISOString(),
            type: "errorResponse",
            data: data.error,
          });

          toast.error(data.error || "Facebook authentication failed");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [locale, login, setDialogState]);

  const { mutate, isPending } = useMutation<AuthResponse, Error, FormData>({
    mutationKey: ["signIn"],
    mutationFn: (formData: FormData) => clientPost("/site/login", formData),
    onSuccess: async (response) => {

      if (!response) {
        toast.error(locale === "ar" ? "حدث خطأ أثناء تسجيل الدخول" : "Login failed");
        return;
      }

      try {
        cookies.set("token", response?.token || "", {
          expires: 1, // 1 day
          path: "/",
          sameSite: "strict",
        });

        // Get user data using token
        const userData = await clientGetUser(response?.token || "");

        if (!userData || !userData.user) {
          toast.error(locale === "ar" ? "حدث خطأ أثناء الحصول على بيانات المستخدم" : "Failed to get user data");
          return;
        }

        login({ ...response, user: userData.user });
        toast.success(response.message || "Successfully logged in!");
        setDialogState(null);
      } catch (error: any) {
        toast.error(error?.message || "Failed to complete login process");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed");
    },
  });

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
          onClick={() => openSocialAuthWindow("facebook")}
          className="flex items-center text-sm bg-blue-500 text-white justify-center gap-2 w-full rounded-full py-2.5 transition-all duration-300 hover:shadow-[0_8px_16px_0_rgba(59,130,246,0.3)] active:scale-[0.98] transform cursor-pointer"
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
          onClick={() => openSocialAuthWindow("google")}
          className="flex items-center text-sm justify-center gap-2 w-full rounded-full py-2.5 border transition-all duration-300 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.1)] hover:bg-gray-50 active:scale-[0.98] transform cursor-pointer"
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
            className={`absolute  top-1/2 -translate-y-1/2 ${showPassword ? "text-primary" : "text-gray-500"
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
    mutationFn: (formData: FormData) => clientPost("/site/register", formData),
    onSuccess: async (response) => {
      if (response.token) {
        cookies.set("token", response.token, {
          expires: 1, // 1 day
          path: "/",
          sameSite: "strict",
        });
        const userData = await clientGetUser(response.token);
        login({ ...response, user: userData.user });
        toast.success(response.message || "Successfully registered!");
        setDialogState(null);
      }
    },
    onError: () => {
      toast.error(locale === "ar" ? "حدث خطأ أثناء التسجيل" : "Registration failed");
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
            className={`absolute top-1/2 -translate-y-1/2 ${showPassword ? "text-primary" : "text-gray-500"
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
            className={`absolute top-1/2 -translate-y-1/2 ${showConfirmPassword ? "text-primary" : "text-gray-500"
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
