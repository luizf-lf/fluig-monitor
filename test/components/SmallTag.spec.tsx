import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';

import i18n from '../../src/common/i18n/i18n';
import SmallTag from '../../src/renderer/components/SmallTag';

// TODO: Update component testing compatibility
describe('Small Tag component', () => {
  it('Should render a staging tag', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SmallTag kind="HML" />
      </I18nextProvider>
    );

    expect(await screen.findByText('HML')).toHaveTextContent('HML');
  });
});
