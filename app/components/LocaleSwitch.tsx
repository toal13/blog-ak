"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const LOCALES = ["sv", "en", "ja"] as const;

export default function LocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toLocale = (lc: (typeof LOCALES)[number]) => {
    const segments = pathname.split("/");
    if (LOCALES.includes(segments[1] as (typeof LOCALES)[number])) {
      segments[1] = lc;
    } else {
      segments.splice(1, 0, lc);
    }
    router.replace(segments.join("/"));
  };

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(v) => v && toLocale(v as (typeof LOCALES)[number])}
      className="gap-1"
    >
      {LOCALES.map((lc) => (
        <ToggleGroupItem
          key={lc}
          value={lc}
          aria-label={`Switch to ${lc}`}
          className="px-3"
        >
          {lc.toUpperCase()}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
