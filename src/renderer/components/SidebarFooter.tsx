import '../assets/styles/components/SidebarFooter.scss';
import { version } from '../../../release/app/package.json';

export default function SidebarFooter(): JSX.Element {
  return (
    <footer id="sidebarFooter">
      <span>
        <b>Fluig Monitor</b> - v{version}
      </span>
    </footer>
  );
}
