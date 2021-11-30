import { FiHelpCircle, FiInfo, FiSliders } from 'react-icons/fi';
import '../assets/styles/components/SidebarFooter.scss';

export default function SidebarFooter(): JSX.Element {
  return (
    <footer id="sidebarFooter">
      <button type="button">
        <FiInfo />
      </button>
      <button type="button">
        <FiHelpCircle />
      </button>
      <button type="button">
        <FiSliders />
      </button>
    </footer>
  );
}
