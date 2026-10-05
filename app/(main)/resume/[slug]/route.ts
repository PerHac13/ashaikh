import { NextRequest, NextResponse } from "next/server";
import { getResumeLinkBySlugOrId, getActiveResumeLink } from "@/actions/resumeActions";
import { recordAnalyticsEvent } from "@/actions/trackingActions";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Asynchronously record resume view event
    if (slug) {
      recordAnalyticsEvent({
        path: `/resume/${slug}`,
        eventType: "resume_view",
        identifier: slug,
      }).catch(() => {});
    }

    if (slug) {
      const { link, error } = await getResumeLinkBySlugOrId(slug);
      if (link && link.url && !error) {
        return NextResponse.redirect(link.url, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      }
    }

    const { link: activeLink } = await getActiveResumeLink();
    if (activeLink && activeLink.url) {
      return NextResponse.redirect(activeLink.url, {
        headers: {
          "Cache-Control": "no-store",
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
    console.error("Error in slug resume redirect:", error);
    const staticPdfPath =
      new URL(request.url).origin + "/resume/Shaikh_Abdullah_Resume.pdf";
    return NextResponse.redirect(staticPdfPath, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
