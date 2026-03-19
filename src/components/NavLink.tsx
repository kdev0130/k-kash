"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

export default function NavLink({
  href,
  children,
  className,
  activeClassName = "text-fuchsia-300",
}: Props) {
  const pathname = usePathname();
  const exact = pathname === href;
  const nested = href !== "/" && pathname?.startsWith(`${href}/`);
  const isActive = Boolean(exact || nested);

  return (
    <Link
      href={href}
      className={`${className ?? ""} ${isActive ? activeClassName : "text-slate-300"}`.trim()}
    >
      {children}
    </Link>
  );
}
