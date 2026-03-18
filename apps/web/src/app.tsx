import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";

export function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/" />
    </Routes>
  );
}
