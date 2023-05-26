import { version } from '../../../../../release/app/package.json';
import logoImage from '../../../assets/img/logo.png';

function Logo() {
  return (
    <>
      <img src={logoImage} alt="Fluig Monitor" />
      <div className="logoData">
        <span className="title">Fluig Monitor</span>
        <span className="version">v{version}</span>
      </div>
    </>
  );
}

export default Logo;
