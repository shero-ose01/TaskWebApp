import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>
          <a href="https://github.com/shero-ose01">Github</a>
        </p>
      </footer>
    </>
  );
}
