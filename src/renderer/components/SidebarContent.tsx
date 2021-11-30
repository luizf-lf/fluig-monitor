import '../assets/styles/components/SidebarContent.scss';
import CreateAmbientButton from './CreateAmbientButton';

export default function SidebarContent(): JSX.Element {
  return (
    <div id="SidebarContentContainer">
      <div id="title">
        <h3>Seus ambientes</h3>
      </div>
      <section id="ambientList">
        <CreateAmbientButton />
      </section>
    </div>
  );
}
