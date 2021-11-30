import { FiMenu } from 'react-icons/fi';
import '../assets/styles/components/SidebarContent.scss';

export default function SidebarContent(): JSX.Element {
  return (
    <div id="SidebarContentContainer">
      <div id="title">
        <h2>Seus ambientes</h2>
        <button type="button">
          <FiMenu />
        </button>
      </div>
    </div>
  );
}
