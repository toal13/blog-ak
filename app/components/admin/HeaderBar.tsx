"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function HeaderBar({
  email,
  photoURL,
  onSignOut,
}: {
  email: string;
  photoURL?: string;
  onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[color:var(--beige-base)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded bg-[color:var(--beige-deep)]" />
          <span className="text-sm tracking-wider">Admin</span>
          <Badge variant="secondary" className="ml-2">
            private
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={photoURL} alt={email} />
            <AvatarFallback>{email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-neutral-600">{email}</span>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
