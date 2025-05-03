"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { ModeToggle } from "./ui/toggle-mode";
import useActiveSection from "@/hooks/useActiveSection";

import { Github, Linkedin } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

export default function Nav() {
  const activeSection = useActiveSection([
    "about",
    "experience",
    "projects",
    "contact",
  ]);

  const navItems: NavItem[] = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavItemClick = (href: string) => {
    const isActive = activeSection === href.substring(1);
    return {
      idClass: isActive ? "active" : "",
      textClass: `nav-text text-xs font-bold uppercase tracking-widest ${
        isActive
          ? "text-foreground"
          : "text-slate-500 group-hover:text-foreground"
      }`,
    };
  };

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 flex flex-col lg:gap-4">
      <div className="flex flex-col gap-4 lg:pr-24 mt-6 lg:mt-0">
        <h1 className="text-[45px] font-bold lg:text-start">
          <a href="/">Shaikh Abdullah</a>
        </h1>
        <h2 className="text-xl lg:text-start">
          Software Engineer, Programmer, Full Stack Developer
        </h2>
        <p className="text-lg lg:text-start text-muted-foreground">
          I dabble in crafting solutions that not only manage to work—imagine
          that!—but also happen to look halfway decent and are, dare I say,
          somewhat intuitive to use.
        </p>
      </div>
      <nav className="lg:flex hidden">
        <ul className="flex flex-col w-max text-start gap-6 uppercase text-xs font-medium">
          {navItems.map((item: NavItem) => {
            const { idClass, textClass } = handleNavItemClick(item.href);
            return (
              <li key={item.label} className="group">
                <a href={item.href} className={`py-3 ${idClass}`}>
                  <span className={textClass}>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="flex flex-row gap-6 mt-6 lg:mt-0">
        <Button variant="outline" size="icon">
          <a
            href="https://github.com/PerHac13"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-[1.5rem] w-[1.5rem]" />
          </a>
        </Button>
        <Button variant="outline" size="icon">
          <a
            href="https://codeforces.com/profile/Perhac"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/codeforces.svg"
              alt="cf"
              height={24}
              width={24}
              className="h-[1.5rem] w-[1.5rem]"
            />
          </a>
        </Button>
        <Button variant="outline" size="icon">
          <a
            href="https://leetcode.com/u/perhac/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/leetcode.svg"
              alt="lc"
              height={24}
              width={24}
              className="h-[1.5rem] w-[1.5rem]"
            />
          </a>
        </Button>
        <Button variant="outline" size="icon">
          <a
            href="https://linkedin.com/in/ashaikh13iiitbh26"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-[1.5rem] w-[1.5rem]" />
          </a>
        </Button>
        <ModeToggle />
      </ul>
    </header>
  );
}
