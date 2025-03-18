"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, Code, LineChart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const username = "Shaikh Abdullah";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <h1 className="text-2xl font-bold mb-8">
          Welcome Back, {username}!
        </h1>
        
        {/* Action Center */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Action Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Experience
                </CardTitle>
                <Briefcase className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Explore your work history and contributions.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push("/admin/experience")}
                >
                  View Experience
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Code className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage your ongoing and completed projects.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push("/admin/project")}
                >
                  View Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Analytics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-auto w-full">
        <h2 className="text-lg font-semibold mb-4">
          Analytics (future scope)
        </h2>
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center gap-4 p-6">
            <LineChart className="h-10 w-10 text-blue-500" />
            <p className="text-gray-600 text-center md:text-left">
              Monitor your site performance with Vercel Analytics.
            </p>
            <Button variant="outline" className="mt-4 md:mt-0 md:ml-auto">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}