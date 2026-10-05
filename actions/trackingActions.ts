"use server";

import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import logger from "@/utils/logger";

export interface RecordEventPayload {
  path: string;
  eventType?: "page_view" | "resume_view" | "project_click" | "blog_click" | "custom";
  identifier?: string;
  metadata?: Record<string, any>;
  referrer?: string;
  deviceType?: string;
}

export async function recordAnalyticsEvent(payload: RecordEventPayload) {
  try {
    await dbConnect();

    // Ignore admin routes from visitor stats
    if (payload.path.startsWith("/admin") || payload.path.startsWith("/api")) {
      return { success: true, ignored: true };
    }

    await AnalyticsEvent.create({
      path: payload.path || "/",
      eventType: payload.eventType || "page_view",
      identifier: payload.identifier || "",
      metadata: payload.metadata || {},
      referrer: payload.referrer || "",
      deviceType: payload.deviceType || "Desktop",
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to record analytics event:", error);
    return { success: false };
  }
}

export interface VisitorAnalyticsStats {
  totalViews: number;
  viewsToday: number;
  viewsLast7Days: number;
  totalResumeViews: number;
  topPaths: { path: string; count: number }[];
  topResumes: { identifier: string; count: number }[];
  eventBreakdown: {
    pageViews: number;
    resumeViews: number;
    projectClicks: number;
    blogClicks: number;
  };
  dailyTrend: { date: string; views: number }[];
}

export async function getVisitorAnalyticsStats(): Promise<{
  success: boolean;
  data?: VisitorAnalyticsStats;
  error?: string;
}> {
  try {
    await dbConnect();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalViews,
      viewsToday,
      viewsLast7Days,
      totalResumeViews,
      pageViewsCount,
      projectClicksCount,
      blogClicksCount,
      topPathsAggregate,
      topResumesAggregate,
      recentEvents,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: "page_view" }),
      AnalyticsEvent.countDocuments({
        eventType: "page_view",
        createdAt: { $gte: startOfToday },
      }),
      AnalyticsEvent.countDocuments({
        eventType: "page_view",
        createdAt: { $gte: sevenDaysAgo },
      }),
      AnalyticsEvent.countDocuments({ eventType: "resume_view" }),
      AnalyticsEvent.countDocuments({ eventType: "page_view" }),
      AnalyticsEvent.countDocuments({ eventType: "project_click" }),
      AnalyticsEvent.countDocuments({ eventType: "blog_click" }),
      AnalyticsEvent.aggregate([
        { $match: { eventType: "page_view" } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventType: "resume_view" } },
        { $group: { _id: "$identifier", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: "page_view",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Build complete 7-day trend array with zero fallbacks
    const dailyTrendMap: Record<string, number> = {};
    recentEvents.forEach((item) => {
      if (item._id) dailyTrendMap[item._id] = item.views;
    });

    const dailyTrend: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const displayStr = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
      dailyTrend.push({
        date: displayStr,
        views: dailyTrendMap[dateStr] || 0,
      });
    }

    return {
      success: true,
      data: {
        totalViews,
        viewsToday,
        viewsLast7Days,
        totalResumeViews,
        topPaths: topPathsAggregate.map((p) => ({ path: p._id || "/", count: p.count })),
        topResumes: topResumesAggregate
          .filter((r) => r._id)
          .map((r) => ({ identifier: r._id, count: r.count })),
        eventBreakdown: {
          pageViews: pageViewsCount,
          resumeViews: totalResumeViews,
          projectClicks: projectClicksCount,
          blogClicks: blogClicksCount,
        },
        dailyTrend,
      },
    };
  } catch (error) {
    logger.error("Failed to load visitor analytics stats:", error);
    return { success: false, error: "Failed to load visitor analytics" };
  }
}
