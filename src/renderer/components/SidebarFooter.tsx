import { FiInfo, FiMoon, FiSliders } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../assets/styles/components/SidebarFooter.scss';

export default function SidebarFooter(): JSX.Element {
  return (
    <footer id="sidebarFooter">
      <Link to="/about">
        <FiInfo />
      </Link>
      <button type="button">
        <FiMoon />
      </button>
      <Link to="/settings">
        <FiSliders />
      </Link>
    </footer>
  );
}
