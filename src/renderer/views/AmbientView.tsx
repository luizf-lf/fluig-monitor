import '../assets/styles/components/CenterView.scss';

export default function Home(): JSX.Element {
  let ambientData = null;

  ambientData = null;

  const defaultMsg = (
    <span>
      Selecione o ambiente ao lado ou utilize o botão <b>&quot;Novo&quot; </b>
      para criar um novo ambiente.
    </span>
  );

  return (
    <div id="centerViewContainer">
      {ambientData === null ? defaultMsg : ambientData}
    </div>
  );
}
