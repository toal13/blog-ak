"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon } from "lucide-react";

export function PostEditor() {
  const [status, setStatus] = useState<"draft" | "published">("draft");

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="tracking-wide">New Post</CardTitle>
        <CardDescription>
          タイトル / 本文 / 公開状態 / カバー画像を入力して保存します。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="my-first-post" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title-sv">Title (sv)</Label>
            <Input id="title-sv" placeholder="Titel" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (markdown supported)</Label>
          <Textarea
            id="content"
            placeholder="# Heading
本文…"
            className="min-h-40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v: "draft" | "published") => setStatus(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="published">published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover image</Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="shrink-0">
                <ImageIcon className="mr-2 h-4 w-4" /> Upload
              </Button>
              <Input
                id="cover"
                type="file"
                accept="image/*"
                className="file:hidden"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline">
            Save draft
          </Button>
          <Button type="button">Publish</Button>
        </div>
      </CardContent>
    </Card>
  );
}
