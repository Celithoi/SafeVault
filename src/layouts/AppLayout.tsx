import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";

export function AppLayout() {
  return (
    <>
      <Header />
      <SideBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
