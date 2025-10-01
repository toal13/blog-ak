"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { Post } from "@/lib/types/post";

export function PostList({ items, locale }: { items: Post[]; locale: string }) {
  if (!items.length)
    return <p className="text-sm text-neutral-500">No posts yet.</p>;

  return (
    <div className="divide-y">
      {items.map((p) => (
        <div
          key={p.slug}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/admin/blog/${p.slug}`}
                className="truncate font-medium hover:underline"
              >
                {p.title ?? p.slug}
              </Link>
              <Badge
                variant={p.status === "published" ? "default" : "secondary"}
              >
                {p.status}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">/{p.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/admin/blog/${p.slug}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <ConfirmDeleteDialog slug={p.slug} />
          </div>
        </div>
      ))}
    </div>
  );
}
