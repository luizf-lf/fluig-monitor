import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

render(
  /* O componente BrowserRouter deve ser colocado neste arquivo para funcionamento do hook useLocation */
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
