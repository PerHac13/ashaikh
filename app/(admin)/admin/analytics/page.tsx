"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Briefcase,
  Folder,
  FileBadge,
  Trophy,
  BookOpen,
  RefreshCw,
  ExternalLink,
  Layers,
  Star,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
  MousePointerClick,
  FileDown,
  Globe,
} from "lucide-react";
import {
  getAdminAnalyticsSummary,
  AnalyticsSummary,
} from "@/actions/analyticsActions";
import {
  getVisitorAnalyticsStats,
  VisitorAnalyticsStats,
} from "@/actions/trackingActions";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorAnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, visitorRes] = await Promise.all([
        getAdminAnalyticsSummary(),
        getVisitorAnalyticsStats(),
      ]);

      if (summaryRes.success && summaryRes.data) {
        setData(summaryRes.data);
      }
      if (visitorRes.success && visitorRes.data) {
        setVisitorStats(visitorRes.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const maxDailyViews = Math.max(
    ...(visitorStats?.dailyTrend.map((d) => d.views) || [1]),
    1
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Portfolio Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time visitor tracking, resume downloads, and content metrics
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Stats
        </Button>
      </div>

      {/* Live Visitor & Traffic Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Live Visitor & Interaction Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-blue-500/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Page Views
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {visitorStats?.totalViews ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {visitorStats?.viewsToday ?? 0} views today
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-purple-500/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Resume Views & Downloads
              </CardTitle>
              <FileDown className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {visitorStats?.totalResumeViews ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across default & multi-resume links
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-500/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Views (Last 7 Days)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {visitorStats?.viewsLast7Days ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active visitor trend
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-amber-500/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Active Resume Link
              </CardTitle>
              <Globe className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold truncate">
                {data?.resumes.activeName || "Default Resume"}
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                /resume/{data?.resumes.activeSlug || "default"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 7-Day Trend Chart & Top Paths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              7-Day Visitor Trend
            </CardTitle>
            <CardDescription>
              Daily page views recorded by native analytics beacon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
              {visitorStats?.dailyTrend.map((d, i) => {
                const heightPercent = Math.max(
                  Math.round((d.views / maxDailyViews) * 100),
                  8
                );
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.views}
                    </span>
                    <div
                      className="w-full max-w-[36px] bg-primary/20 group-hover:bg-primary rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground truncate max-w-full">
                      {d.date.split(",")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-blue-500" />
              Top Visited Paths
            </CardTitle>
            <CardDescription>
              Most requested pages & resume links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {visitorStats && visitorStats.topPaths.length > 0 ? (
              visitorStats.topPaths.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                >
                  <span className="font-mono truncate mr-2">{p.path}</span>
                  <Badge variant="secondary" className="text-xs">
                    {p.count} views
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No visitor data recorded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Content Distributions */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Portfolio Content Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievements Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Achievement Categories ({data?.achievements.total ?? 0})
              </CardTitle>
              <CardDescription>
                Awards, certifications, and contest milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data && Object.keys(data.achievements.categories).length > 0 ? (
                Object.entries(data.achievements.categories).map(([category, count]) => {
                  const percentage = Math.round(
                    (count / (data.achievements.total || 1)) * 100
                  );
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{category}</span>
                        <span className="text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground">
                  No achievement categories recorded yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Blogs by Platform */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Article Publishing Platforms ({data?.blogs.total ?? 0})
              </CardTitle>
              <CardDescription>
                Platforms and series ({data?.blogs.seriesCount ?? 0} active series)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data && Object.keys(data.blogs.platforms).length > 0 ? (
                Object.entries(data.blogs.platforms).map(([platform, count]) => {
                  const percentage = Math.round(
                    (count / (data.blogs.total || 1)) * 100
                  );
                  return (
                    <div key={platform} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{platform}</span>
                        <span className="text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground">
                  No blog platform data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
