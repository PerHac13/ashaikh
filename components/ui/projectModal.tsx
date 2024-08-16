import React, { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ProjectModal({ selectedProject, onClose }: any) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 px-10">
      <div
        ref={modalRef}
        className="bg-card p-6 rounded-lg max-w-3xl w-full relative shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary hover:text-primary-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex gap-4 items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            {selectedProject.title}
          </h2>
          <span className="text-muted-foreground">
            {selectedProject.timeline}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedProject.tag?.map((tag: string, index: number) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
        <p className="mb-4 text-foreground">{selectedProject.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedProject.skill?.map((skill: any, index: any) => (
            <Badge key={index}>{skill}</Badge>
          ))}
        </div>
        {Array.isArray(selectedProject.link) &&
          selectedProject.link.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-primary mb-2">Links:</p>
              {selectedProject.link.map((link: string, index: number) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline mb-1"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
