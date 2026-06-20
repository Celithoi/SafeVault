import { Link } from "react-router-dom";

export function SideBar() {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <Link to="/app">Dashboard</Link>
          </li>
          <li>
            <Link to="/app/folders">Folders</Link>
          </li>
          <li>
            <Link to="/app/profile">Profile</Link>
          </li>
          <li>
            <Link to="/app/settings">Settings</Link>
          </li>
          <li>
            <Link to="/login">Sair (Simulação)</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
