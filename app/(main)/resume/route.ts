import { NextRequest, NextResponse } from "next/server";
import { getActiveResumeLink } from "@/actions/resumeActions";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { link, error } = await getActiveResumeLink();

    if (link && link.url && !error) {
      return NextResponse.redirect(link.url, {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    const staticPdfPath =
      new URL(request.url).origin + "/resume/Shaikh_Abdullah_Resume.pdf";
    return NextResponse.redirect(staticPdfPath);
  } catch (error) {
    console.error("Error in resume redirect:", error);

    const staticPdfPath =
      new URL(request.url).origin + "/resume/Shaikh_Abdullah_Resume.pdf";
    return NextResponse.redirect(staticPdfPath);
  }
}
