import { useContext } from 'react';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import '../assets/styles/components/SidebarContent.scss';
import CreateAmbientButton from './CreateAmbientButton';
import AmbientListItem from './AmbientListItem';
import AmbientListContext from '../contexts/AmbientListContext';

export default function SidebarContent(): JSX.Element {
  const [ambientList] = useContext(AmbientListContext);

  return (
    <div id="SidebarContentContainer">
      <div id="title">
        <h3>Seus ambientes</h3>
      </div>
      <section id="ambientList">
        {ambientList.length === 0 ? (
          <span style={{ color: 'var(--fade)' }}>
            Nenhum ambiente cadastrado.
          </span>
        ) : (
          ambientList.map((ambient: AmbientDataInterface) => (
            <AmbientListItem data={ambient} key={ambient.uuid} />
          ))
        )}
        <CreateAmbientButton />
      </section>
    </div>
  );
}
