import "./admin.css";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="zelora-admin">{children}</div>;
}