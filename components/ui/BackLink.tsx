"use client";

import { MoveLeft } from "lucide-react";

export default function BackLink({ title = "ashaikh" }: { title?: string }) {
  return (
    <a
      className="inline-flex items-center font-medium leading-tight text-foreground group cursor-pointer"
      onClick={() => window.history.back()}
    >
      <span className="pb-px transition motion-reduce:transition-none">
        <MoveLeft className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:-translate-x-2 group-focus-visible:-translate-x-2 motion-reduce:transition-none" />
        {"  "} {title}
      </span>
    </a>
  );
}
