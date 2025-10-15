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
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <div className="flex-1 flex items-center justify-center p-4 pb-32">
          <Card className="w-full max-w-md">
            {title && (
              <CardHeader>
                <CardTitle className="tracking-wide">{title}</CardTitle>
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
            )}
            {children && <CardContent>{children}</CardContent>}
          </Card>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-neutral-50">{children}</div>;
}
