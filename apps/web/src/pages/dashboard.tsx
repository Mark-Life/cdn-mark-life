import { useAuth } from "@workos-inc/authkit-react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/convex/_generated/api";

export function Dashboard() {
  const { signIn, signOut } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-bold text-4xl">CDN Mark Life</h1>

      {(() => {
        if (isLoading) {
          return <p className="text-muted-foreground">Loading...</p>;
        }
        if (isAuthenticated) {
          return (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg">
                Signed in as{" "}
                <span className="font-semibold">{user?.email}</span>
              </p>
              <button
                className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
                onClick={() => signOut()}
                type="button"
              >
                Sign out
              </button>
            </div>
          );
        }
        return (
          <button
            className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
            onClick={() => {
              signIn();
            }}
            type="button"
          >
            Sign in
          </button>
        );
      })()}
    </div>
  );
}
