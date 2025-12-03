export default function Footer() {
  return (
    <footer className="mt-16 ">
      <div className="mx-auto w-full px-4 py-6">
        <p className="text-center text-xs tracking-wide text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
