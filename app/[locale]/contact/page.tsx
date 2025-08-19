"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    // ここでAPI呼び出しなどに差し替え
    // const form = new FormData(e.currentTarget);
    // await fetch("/api/contact", { method: "POST", body: form });

    setTimeout(() => setSending(false), 600); // 仮の処理
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
