"use client";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock } from "lucide-react";

export function ForbiddenCard({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 tracking-wide">
          <ShieldAlert className="h-5 w-5" /> 403 Forbidden
        </CardTitle>
        <CardDescription>
          許可されたアカウントのみアクセスできます。
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Access denied</AlertTitle>
          <AlertDescription>
            管理者以外のログインは自動的に拒否されます。
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="px-0">
        <Button variant="outline" className="w-full" onClick={onClose}>
          OK
        </Button>
      </CardFooter>
    </div>
  );
}
