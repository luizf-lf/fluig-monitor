import { ipcRenderer } from 'electron';
import { Suspense } from 'react';
import { render } from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { HashRouter } from 'react-router-dom';
import App from './App';
import i18n from '../i18n/i18n';

// listens for the custom 'languageChanged' event from main, triggering the language change on the renderer
ipcRenderer.on(
  'languageChanged',
  (_event, { language, namespace, resource }) => {
    if (!i18n.hasResourceBundle(language, namespace)) {
      i18n.addResourceBundle(language, namespace, resource);
    }

    i18n.changeLanguage(language);
  }
);

// ensures that the initial rendered language is the one saved locally
i18n.language = ipcRenderer.sendSync('getLanguage');

render(
  <Suspense fallback="Loading">
    <I18nextProvider i18n={i18n}>
      {/* The HashRouter component must be used here in order for the useLocation hook to work. */}
      <HashRouter>
        <App />
      </HashRouter>
    </I18nextProvider>
  </Suspense>,
  document.getElementById('root')
);
