import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app-shell";
import { AuthGate } from "./components/auth-gate";
import { Dashboard } from "./pages/dashboard";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="font-mono text-muted-foreground text-sm">{title}</p>
    </div>
  );
}

export function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<Dashboard />} index />
          <Route
            element={<Placeholder title="Files — Phase 3" />}
            path="/files"
          />
          <Route
            element={<Placeholder title="Accounts — Phase 2" />}
            path="/accounts"
          />
        </Route>
      </Routes>
    </AuthGate>
  );
}
