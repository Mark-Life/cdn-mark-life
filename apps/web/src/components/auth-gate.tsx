import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useConvexAuth } from "convex/react";
import {
  ArrowRightIcon,
  DatabaseIcon,
  GlobeIcon,
  ShieldIcon,
} from "lucide-react";
import type { ReactNode } from "react";

function AuthLoading() {
  return (
    <div className="flex h-svh w-full items-center justify-center bg-background">
      <div className="flex w-full max-w-sm flex-col gap-6 px-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-9 w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    </div>
  );
}

function SignInScreen() {
  const { signIn } = useAuth();

  return (
    <div className="flex h-svh w-full items-center justify-center bg-background">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-8 px-6">
        {/* Brand mark */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary">
              <span className="font-mono font-semibold text-primary-foreground text-xs">
                CDN
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight">
                Mark Life
              </span>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                File Management
              </span>
            </div>
          </div>

          <div className="mt-2 h-px w-full bg-border" />

          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Manage files across accounts with S3 storage and CloudFront CDN
            delivery.
          </p>
        </div>

        {/* Sign in */}
        <Button
          className="h-10 gap-2 font-medium"
          onClick={() => signIn()}
          size="lg"
        >
          Sign in to continue
          <ArrowRightIcon className="size-3.5" />
        </Button>

        {/* Feature hints */}
        <div className="flex flex-col gap-2.5">
          {[
            { icon: DatabaseIcon, text: "Prefix-isolated S3 storage" },
            { icon: GlobeIcon, text: "CloudFront CDN distribution" },
            { icon: ShieldIcon, text: "WorkOS enterprise authentication" },
          ].map(({ icon: Icon, text }) => (
            <div
              className="flex items-center gap-2.5 text-muted-foreground"
              key={text}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="font-mono text-[11px] tracking-wide">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return <>{children}</>;
}
