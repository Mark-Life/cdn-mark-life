import { useQuery } from "convex/react";
import { DatabaseIcon, FolderIcon, GlobeIcon } from "lucide-react";
import { api } from "../../../convex/convex/_generated/api";

export function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-lg tracking-tight">
          {user
            ? `Welcome, ${[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}`
            : "Dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your files and accounts from here.
        </p>
      </div>

      {/* Quick stats placeholders */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: FolderIcon,
            label: "Files",
            value: "--",
            sub: "Across all accounts",
          },
          {
            icon: DatabaseIcon,
            label: "Storage",
            value: "--",
            sub: "Total usage",
          },
          {
            icon: GlobeIcon,
            label: "CDN",
            value: "Active",
            sub: "static.mark-life.com",
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div
            className="flex flex-col gap-3 rounded-lg border p-4"
            key={label}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-3.5" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {label}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-2xl tracking-tight">
                {value}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
