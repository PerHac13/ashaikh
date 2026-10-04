"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Briefcase,
  Folder,
  FileBadge,
  Trophy,
  BookOpen,
  LineChart,
  BarChart3,
} from "lucide-react";
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
        <h1 className="text-2xl font-bold mb-8">Welcome Back, {username}!</h1>

        {/* Action Center */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Action Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Experience
                </CardTitle>
                <Briefcase className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your work history and positions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/experience")}
                >
                  Manage Experience
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Folder className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your ongoing and completed projects.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/project")}
                >
                  Manage Projects
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resume</CardTitle>
                <FileBadge className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage active resumes and multi-share links.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/resume")}
                >
                  Manage Resumes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Showcase awards, hackathons, and certifications.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/achievement")}
                >
                  Manage Achievements
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blogs & Series</CardTitle>
                <BookOpen className="h-5 w-5 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Publish articles, manage blog series & redirect links.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/blog")}
                >
                  Manage Blogs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  View portfolio metrics, breakdowns, and stats.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/admin/analytics")}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Analytics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-auto w-full">
        <h2 className="text-lg font-semibold mb-4">Portfolio Analytics & Insights</h2>
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center gap-4 p-6">
            <LineChart className="h-10 w-10 text-blue-500 shrink-0" />
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
              Explore content distribution, project statuses, series metrics, and site insights.
            </p>
            <Button
              variant="default"
              className="mt-4 md:mt-0 md:ml-auto shrink-0"
              onClick={() => router.push("/admin/analytics")}
            >
              Open Analytics Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
