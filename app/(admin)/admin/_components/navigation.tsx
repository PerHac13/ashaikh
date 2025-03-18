"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  Folder,
  Settings,
  LogOut,
  MoveLeft,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
  onItemClick?: () => void;
}

const SidebarItem = ({ name, icon, link, onClick, onItemClick }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === link;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      router.push(link);
    }
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      role="button"
      onClick={handleClick}
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

interface NavigationProps {
  onItemClick?: () => void;
}

export const Navigation = ({ onItemClick }: NavigationProps) => {
  const { logout } = useAuth();
  
  return (
    <aside className="h-full w-60 bg-secondary shadow-md flex flex-col justify-between p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-primary">ASHAIKH</div>
        <button className="lg:hidden p-1" onClick={onItemClick}>
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <SidebarItem 
          name="Home" 
          icon={<Home size={20} />} 
          link="/admin" 
          onItemClick={onItemClick}
        />
        <SidebarItem
          name="Experience"
          icon={<Briefcase size={20} />}
          link="/admin/experience"
          onItemClick={onItemClick}
        />
        <SidebarItem
          name="Projects"
          icon={<Folder size={20} />}
          link="/admin/project"
          onItemClick={onItemClick}
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t pt-4">
        <SidebarItem
          name="Back to Portfolio"
          icon={<MoveLeft size={20} />}
          link="/"
          onItemClick={onItemClick}
        />
        <SidebarItem
          name="Settings"
          icon={<Settings size={20} />}
          link="/settings"
          onItemClick={onItemClick}
        />
        <SidebarItem
          name="Logout"
          icon={<LogOut size={20} />}
          onClick={() => {
            logout();
            if (onItemClick) onItemClick();
          }}
        />
      </div>
    </aside>
  );
};