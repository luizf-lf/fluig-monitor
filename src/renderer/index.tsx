import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';

render(
  /* The HashRouter component must be used here in order for the useLocation hook to work. */
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
