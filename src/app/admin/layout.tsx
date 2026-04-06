// Minimal admin layout — no auth check here.
// Auth and sidebar are handled by the (dashboard) route group layout.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
