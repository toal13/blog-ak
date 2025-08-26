// "use client";

// import { useRef, useState } from "react";
// import { db, storage } from "@/lib/firebase/client";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes } from "firebase/storage";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// type Props = {
//   mode: "create" | "edit";
//   initial?: any;
// };

// export function PostForm({ mode, initial }: Props) {
//   const router = useRouter();
//   const [slug, setSlug] = useState(initial?.slug ?? "");
//   const [title, setTitle] = useState(initial?.title?.sv ?? "");
//   const [content, setContent] = useState(initial?.content?.sv ?? "");
//   const [status, setStatus] = useState<"draft" | "published">(
//     initial?.status ?? "draft"
//   );
//   const fileRef = useRef<HTMLInputElement>(null);
//   const [saving, setSaving] = useState(false);

//   const onSubmit = async () => {
//     if (!slug) return toast.error("Slug is required");
//     setSaving(true);

//     // 1) カバー画像アップロード（任意）
//     let coverPath = initial?.coverPath as string | undefined;
//     const file = fileRef.current?.files?.[0];
//     if (file) {
//       const ext = file.name.split(".").pop() || "jpg";
//       coverPath = `posts/${slug}/cover.${ext}`;
//       await uploadBytes(ref(storage, coverPath), file);
//     }

//     // 2) Firestore へ保存
//     const now = Date.now();
//     await setDoc(
//       doc(db, "posts", slug),
//       {
//         id: slug,
//         slug,
//         title: { sv: title, en: title, ja: title },
//         content: { sv: content },
//         status,
//         coverPath,
//         updatedAt: now,
//         createdAt: initial?.createdAt ?? now,
//       },
//       { merge: true }
//     );

//     setSaving(false);
//     toast.success(mode === "create" ? "Created" : "Updated");
//     router.push("../"); // 一覧に戻る
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 sm:grid-cols-2">
//         <div className="space-y-2">
//           <Label htmlFor="slug">Slug</Label>
//           <Input
//             id="slug"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//             placeholder="my-first-post"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="title">Title (sv)</Label>
//           <Input
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Titel"
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="content">Content (markdown)</Label>
//         <Textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="min-h-40"
//         />
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2">
//         <div className="space-y-2">
//           <Label>Status</Label>
//           <Select value={status} onValueChange={(v) => setStatus(v as any)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="draft">draft</SelectItem>
//               <SelectItem value="published">published</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="cover">Cover image</Label>
//           <Input ref={fileRef} id="cover" type="file" accept="image/*" />
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <Button
//           variant="outline"
//           type="button"
//           disabled={saving}
//           onClick={onSubmit}
//         >
//           {mode === "create" ? "Save draft" : "Save changes"}
//         </Button>
//         <Button
//           type="button"
//           disabled={saving}
//           onClick={() => {
//             setStatus("published");
//             onSubmit();
//           }}
//         >
//           Publish
//         </Button>
//       </div>
//     </div>
//   );
// }
