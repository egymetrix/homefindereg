"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

// Types
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

const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
  services: [
    { href: "/buy", label: "Buy Property" },
    { href: "/sell", label: "Sell Property" },
    { href: "/rent", label: "Rent Property" },
    { href: "/valuation", label: "Property Valuation" },
    { href: "/investment", label: "Investment Advisory" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

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

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = "",
}) => (
  <li>
    <Link
      href={href}
      className={`text-sm text-gray-400 hover:text-white transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  </li>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
                  width={130}
                  height={45}
                  className="brightness-0 invert"
                  priority
                />
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your trusted partner in real estate, helping people find their
                dream homes since 1980.
              </p>
              <div className="flex items-center gap-5">
                {SOCIAL_LINKS.map((link) => (
                  <SocialLink key={link.label} {...link} />
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div className="lg:ml-8">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                Company
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.company.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                Services
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.services.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
                Legal
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800"></div>

        {/* Enhanced Footer Bottom */}
        <div className="py-8">
          {/* Copyright and Company Info */}
          <div className="flex flex-wrap justify-center  items-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span>© {currentYear} Dream Home Finder</span>
            <span className="hidden lg:block">•</span>
            <span>All rights reserved</span>
            <span className="hidden lg:block">•</span>
            <span>License #123456789</span>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-500 text-center mt-8 max-w-3xl mx-auto leading-relaxed">
            The information provided on this website does not constitute legal
            advice and should be used for informational purposes only. Dream
            Home Finder makes no warranties about the accuracy or completeness
            of the information contained on this site.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
