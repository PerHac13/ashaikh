import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight, BookOpen, Layers, Link as LinkIcon } from "lucide-react";
import { getBlogs } from "@/actions/blogActions";
import { IBlog } from "@/types/blog";

export default async function Blogs() {
  let blogs: IBlog[] = [];

  try {
    const res = await getBlogs({ featured: true });
    if (res.success && res.data) {
      blogs = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section id="blogs" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Articles & Writings
        </h2>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => {
          const dateStr = blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "";

          const targetUrl = blog.redirectUrl || `/blog/${blog.slug}`;

          return (
            <div key={blog._id} className="group">
              <Card className="lg:p-6 mb-6 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200 transition-all">
                <CardHeader className="h-full w-full lg:w-1/4 p-0 mb-2 lg:mb-0">
                  <CardTitle className="text-sm text-slate-400 font-medium whitespace-nowrap">
                    {dateStr}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blog.platform && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {blog.platform}
                      </Badge>
                    )}
                    {blog.readTime && (
                      <span className="text-[11px] text-muted-foreground self-center">
                        {blog.readTime}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col p-0 w-full lg:w-3/4">
                  {blog.isSeries && blog.seriesName && (
                    <div className="mb-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                        <Layers className="h-3 w-3" />
                        {blog.seriesName} • Part {blog.seriesPart || 1}
                      </span>
                    </div>
                  )}

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold inline-flex items-center group-hover:text-primary transition-colors text-base"
                  >
                    <span>{blog.title}</span>
                    <MoveUpRight className="ml-1.5 inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>

                  <CardDescription className="py-2.5 text-muted-foreground text-sm">
                    {blog.description}
                  </CardDescription>

                  {/* Related series / sub-blogs */}
                  {blog.relatedLinks && blog.relatedLinks.length > 0 && (
                    <div className="mt-1 mb-3 pt-2 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1 mb-1.5">
                        <LinkIcon className="h-3 w-3" />
                        Related in this series:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedLinks.map((rel, idx) => (
                          <a
                            key={idx}
                            href={rel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 bg-secondary/50 px-2 py-1 rounded text-xs transition-colors"
                          >
                            <span>{rel.title}</span>
                            <MoveUpRight className="h-2.5 w-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <CardFooter className="p-0 flex flex-wrap gap-1.5 mt-1">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </CardFooter>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
