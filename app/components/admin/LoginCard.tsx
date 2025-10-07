// "use client";
// import { Button } from "@/components/ui/button";
// import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// function GoogleIcon() {
//   return (
//     <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" aria-hidden>
//       <path
//         fill="#4285f4"
//         d="M533.5 278.4a320 320 0 0 0-5.1-57.3H272.1v108.5h146.9a125.7 125.7 0 0 1-54.6 82.5v68h88.3c51.6-47.6 80.8-117.8 80.8-201.7z"
//       />
//       <path
//         fill="#34a853"
//         d="M272.1 544.3c73.1 0 134.4-24.1 179.2-65.1l-88.3-68c-24.5 16.5-55.8 26.1-90.9 26.1-69.8 0-128.9-47.1-150.1-110.4H31.6v69.8A272.1 272.1 0 0 0 272.1 544.3z"
//       />
//       <path
//         fill="#fbbc04"
//         d="M121.9 326.9c-5.6-16.5-8.8-34.2-8.8-52.4s3.2-35.9 8.8-52.4V152.3H31.6A272.1 272.1 0 0 0 0 274.5c0 43.9 10.5 85.3 31.6 122.2l90.3-69.8z"
//       />
//       <path
//         fill="#ea4335"
//         d="M272.1 108.6c39.7 0 75.3 13.7 103.2 40.5l77.4-77.4C406.5 25.1 345.2 0 272.1 0A272.1 272.1 0 0 0 31.6 152.3l90.3 69.8c21.2-63.3 80.3-113.5 150.2-113.5z"
//       />
//     </svg>
//   );
// }

// export function LoginCard({
//   error,
//   onSignIn,
// }: {
//   error: string | null;
//   onSignIn: () => void;
// }) {
//   return (
//     <div className="space-y-4">
//       <CardHeader className="p-0">
//         <CardTitle className="tracking-wide">Admin Login</CardTitle>
//         <CardDescription>
//           Googleでサインインしてください（許可済みアカウントのみ）。
//         </CardDescription>
//       </CardHeader>
//       {error && (
//         <Alert variant="destructive">
//           <AlertTitle>Sign-in error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       <Button className="w-full" variant="outline" onClick={onSignIn}>
//         <GoogleIcon />
//         <span className="ml-2">Continue with Google</span>
//       </Button>
//       <p className="text-[11px] leading-5 text-neutral-500">
//         このページは非公開です。認証済みの管理者のみ編集できます。
//       </p>
//     </div>
//   );
// }
