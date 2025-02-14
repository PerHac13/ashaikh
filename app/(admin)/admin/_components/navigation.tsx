"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  Folder,
  Settings,
  LogOut,
  MoveLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
}

const SidebarItem = ({ name, icon, link, onClick }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === link;

  return (
    <div
      role="button"
      onClick={onClick || (link ? () => router.push(link) : undefined)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition",
        isActive
          ? "bg-primary/10 shadow-md text-primary font-semibold"
          : "hover:bg-gray-200 dark:hover:bg-gray-700"
      )}
    >
      {icon}
      <span>{name}</span>
    </div>
  );
};

export const Navigation = () => {
  const { logout } = useAuth();
  return (
    <aside className="h-full w-60 bg-secondary shadow-md flex flex-col justify-between p-4">
      <div className="text-xl font-bold text-primary mb-6">ASHAIKH</div>

      <div className="flex flex-col gap-2">
        <SidebarItem name="Home" icon={<Home size={20} />} link="/admin" />
        <SidebarItem
          name="Experience"
          icon={<Briefcase size={20} />}
          link="/admin/experience"
        />
        <SidebarItem
          name="Projects"
          icon={<Folder size={20} />}
          link="/admin/project"
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t pt-4">
        <SidebarItem
          name="Back to Porfolio"
          icon={<MoveLeft size={20} />}
          link="/"
        />
        <SidebarItem
          name="Settings"
          icon={<Settings size={20} />}
          link="/settings"
        />
        <SidebarItem
          name="Logout"
          icon={<LogOut size={20} />}
          onClick={logout}
        />
      </div>
    </aside>
  );
};
