"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Redirecting to /admin", isAuthenticated);
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-full">
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default AuthLayout;
