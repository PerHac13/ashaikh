import { NextRequest, NextResponse } from "next/server";
import { getActiveResumeLink } from "@/actions/resumeActions";
import { recordAnalyticsEvent } from "@/actions/trackingActions";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Asynchronously record resume view event
    recordAnalyticsEvent({
      path: "/resume",
      eventType: "resume_view",
      identifier: "default",
    }).catch(() => {});

    const { link, error } = await getActiveResumeLink();

    if (link && link.url && !error) {
      return NextResponse.redirect(link.url, {
        headers: {
          "Cache-Control": "no-store", // force no cache
        },
      });
    }

    const staticPdfPath =
      new URL(request.url).origin + "/resume/Shaikh_Abdullah_Resume.pdf";
    return NextResponse.redirect(staticPdfPath, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error in resume redirect:", error);
    const staticPdfPath =
      new URL(request.url).origin + "/resume/Shaikh_Abdullah_Resume.pdf";
    return NextResponse.redirect(staticPdfPath, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
