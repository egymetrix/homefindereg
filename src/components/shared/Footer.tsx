"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

// Constants
const SOCIAL_LINKS: SocialLinkProps[] = [
  {
    href: "https://facebook.com",
    icon: <Facebook className="w-4 h-4" />,
    label: "Facebook",
  },
  {
    href: "https://instagram.com",
    icon: <Instagram className="w-4 h-4" />,
    label: "Instagram",
  },
  {
    href: "https://linkedin.com",
    icon: <Linkedin className="w-4 h-4" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com",
    icon: <Twitter className="w-4 h-4" />,
    label: "Twitter",
  },
];

// Helper Components
const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors duration-200"
    aria-label={label}
  >
    {icon}
  </Link>
);

const FooterLink: React.FC<FooterLinkProps & { icon?: React.ReactNode }> = ({
  href,
  children,
  className = "",
  icon,
}) => (
  <li>
    <Link
      href={href}
      className={`text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 ${className}`}
    >
      {icon}
      {children}
    </Link>
  </li>
);

const Footer: React.FC = () => {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const FOOTER_LINKS = {
    contact: [
      {
        href: "https://goo.gl/maps/...",
        label: "Heliopolis, Cairo Governorate, Egypt",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        href: "tel:+201501234567",
        label: "+20 150 123 4567",
        icon: <Phone className="w-4 h-4" />,
      },
      {
        href: "mailto:contact@homefindereg.com",
        label: "contact@homefindereg.com",
        icon: <Mail className="w-4 h-4" />,
      },
    ],
    navigation: [
      { href: "/sell-property", label: t("sellProperty") },
      { href: "/services/property-evaluation", label: t("propertyEvaluation") },
      {
        href: "/services/engineering-consultancy",
        label: t("engineeringConsultancy"),
      },
      { href: "/services/thermal-insulation", label: t("thermalInsulation") },
    ],
    help: [
      { href: "/about", label: t("aboutUs") },
      { href: "/contact", label: t("contactUs") },
      // { href: "/privacy", label: t("privacyPolicy") },
    ],
  };

  return (
    <footer className="bg-[#1B2431] text-gray-300">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
            {/* Company Info */}
            <div className="space-y-8">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Dream Home Finder"
                  width={180}
                  height={60}
                  className="brightness-0 invert"
                  priority
                />
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t("companyDescription")}
              </p>
              <div className="flex items-center gap-5">
                {SOCIAL_LINKS.map((link) => (
                  <SocialLink key={link.label} {...link} />
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:ml-8">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                {t("contact")}
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.contact.map(({ href, label, icon }) => (
                  <FooterLink key={href} href={href} icon={icon}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                {t("navigation")}
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.navigation.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                {t("help")}
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.help.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-800"></div>

        <div className="py-8">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span>
              © {currentYear} {t("companyName")}
            </span>
            <span className="hidden lg:block">•</span>
            <span>{t("allRightsReserved")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
