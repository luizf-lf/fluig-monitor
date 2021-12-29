import { useEffect, useState } from 'react';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import dbHandler from '../../utils/dbHandler';
import '../assets/styles/components/SidebarContent.scss';
import CreateAmbientButton from './CreateAmbientButton';
import AmbientListItem from './AmbientListItem';

function getAmbientList() {
  const ambients = dbHandler.ambients.getAll();
  if (ambients.length === 0) {
    return (
      <span style={{ color: 'var(--fade)' }}>Nenhum ambiente cadastrado.</span>
    );
  }
  return ambients.map((ambient: AmbientDataInterface) => {
    return <AmbientListItem data={ambient} />;
  });
}

export default function SidebarContent(): JSX.Element {
  const [ambientList, setAmbientList] = useState(<></>);

  useEffect(() => {
    setAmbientList(getAmbientList());
  }, []);

  return (
    <div id="SidebarContentContainer">
      <div id="title">
        <h3>Seus ambientes</h3>
      </div>
      <section id="ambientList">
        {ambientList}
        <CreateAmbientButton />
      </section>
    </div>
  );
}
