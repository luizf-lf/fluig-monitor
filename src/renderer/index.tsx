import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';

render(
  /* O componente HashRouter deve ser colocado neste arquivo para funcionamento do hook useLocation */
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
