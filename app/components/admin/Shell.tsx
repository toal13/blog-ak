"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  children?: React.ReactNode;
  variant?: "page" | "card";
  title?: string;
  description?: string;
};

export function Shell({
  children,
  variant = "page",
  title,
  description,
}: Props) {
  if (variant === "card") {
    return (
      <div className="min-h-dvh grid place-items-center bg-[var(--beige-bg)]">
        <Card className="w-[420px]">
          {title && (
            <CardHeader>
              <CardTitle className="tracking-wide">{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          {children && <CardContent>{children}</CardContent>}
        </Card>
      </div>
    );
  }

  return <div className="min-h-dvh bg-[var(--beige-bg)]">{children}</div>;
}
