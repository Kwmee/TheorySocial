import { Outlet } from "react-router-dom";
import { TermsModal } from "./TermsModal";

export function AppLayout() {
  return (
    <>
      <div className="app-layout-shell">
        <Outlet />
      </div>
      <TermsModal />
    </>
  );
}
