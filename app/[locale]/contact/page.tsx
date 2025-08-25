"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      tel: (form.elements.namedItem("tel") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
      locale: document.documentElement.lang, // sv/en/ja を自動添付
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");

      toast.success(t("toast.success.title"), {
        description: t("toast.success.desc"),
      });

      form.reset();
    } catch {
      toast.error(t("toast.error.title"), {
        description: t("toast.error.desc"),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container mx-auto py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("intro")}</p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="name">
            {t("name")} <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder={t("ph.name")} required />
        </div>

        <div>
          <Label htmlFor="tel">{t("tel")}</Label>
          <Input id="tel" name="tel" placeholder={t("ph.tel")} />
        </div>

        <div>
          <Label htmlFor="email">
            {t("email")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("ph.email")}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">{t("titleLabel")}</Label>
          <Input id="title" name="title" placeholder={t("ph.title")} />
        </div>

        <div>
          <Label htmlFor="message">
            {t("message")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder={t("ph.message")}
            required
            rows={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={sending}>
          {sending ? t("sending") : t("send")}
        </Button>
      </form>
    </div>
  );
}
