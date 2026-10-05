"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, BookOpen, Layers } from "lucide-react";
import { IBlog } from "@/types/blog";
import { useBlogActions } from "@/hooks/useBlogActions";
import BlogFormModal from "../_components/blog/BlogFormModal";
import BlogCard from "../_components/blog/BlogCard";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string>("all");

  const { getBlogs, deleteBlog, isLoading, isDeleting } = useBlogActions();

  const fetchBlogs = async () => {
    const data = await getBlogs();
    setBlogs(data || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: IBlog) => {
    setEditingBlog(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const ok = await deleteBlog(id);
      if (ok) {
        fetchBlogs();
      }
    }
  };

  const uniqueSeries = Array.from(
    new Set(
      blogs
        .filter((b) => b.isSeries && b.seriesName)
        .map((b) => b.seriesName as string)
    )
  );

  const filteredBlogs =
    selectedSeries === "all"
      ? blogs
      : selectedSeries === "standalone"
      ? blogs.filter((b) => !b.isSeries)
      : blogs.filter((b) => b.seriesName === selectedSeries);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Blogs & Series Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage external redirect blogs, series, sub-articles, and topics
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Blog
        </Button>
      </div>

      {uniqueSeries.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
          <Button
            variant={selectedSeries === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeries("all")}
            className="text-xs"
          >
            All Blogs ({blogs.length})
          </Button>
          <Button
            variant={selectedSeries === "standalone" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeries("standalone")}
            className="text-xs"
          >
            Standalone ({blogs.filter((b) => !b.isSeries).length})
          </Button>
          {uniqueSeries.map((series) => (
            <Button
              key={series}
              variant={selectedSeries === series ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeries(series)}
              className="text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Layers className="h-3.5 w-3.5" />
              {series} ({blogs.filter((b) => b.seriesName === series).length})
            </Button>
          ))}
        </div>
      )}

      <BlogFormModal
        isOpen={modalOpen}
        blog={editingBlog}
        onClose={handleCloseModal}
        onSuccess={fetchBlogs}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading blogs...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No blogs found. Click &quot;Add Blog&quot; to publish your first article or series!
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((item) => (
            <BlogCard
              key={item._id}
              blog={item}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
