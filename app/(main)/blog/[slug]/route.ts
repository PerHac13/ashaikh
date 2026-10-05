import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/actions/blogActions";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (slug) {
      const { success, data: blog } = await getBlogBySlug(slug);
      if (success && blog && blog.redirectUrl) {
        return NextResponse.redirect(blog.redirectUrl, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      }
    }

    const homeUrl = new URL(request.url).origin + "/#blogs";
    return NextResponse.redirect(homeUrl, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error in blog redirect:", error);
    const homeUrl = new URL(request.url).origin + "/#blogs";
    return NextResponse.redirect(homeUrl, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
