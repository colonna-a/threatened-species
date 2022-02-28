import React from 'react';
import createCache from '@emotion/cache';
import { EuiPage, EuiPageBody, EuiProvider } from '@elastic/eui';
import { useProvider } from '../provider';
import styles from './chrome.module.scss';

/**
 * Renders the UI that surrounds the page content.
 */
const Chrome = ({ children }) => {
  const { colorMode } = useProvider();

  /**
   * This `@emotion/cache` instance is used to insert the global styles
   * into the correct location in `<head>`. Otherwise they would be
   * inserted after the static CSS files, resulting in style clashes.
   * Only necessary until EUI has converted all components to CSS-in-JS:
   * https://github.com/elastic/eui/issues/3912
   */
  const emotionCache = createCache({
    key: 'eui-styles',
    container:
      typeof document !== 'undefined'
        ? document.querySelector('meta[name="eui-styles-global"]')
        : null,
  });

  return (
    <EuiProvider colorMode={colorMode} cache={emotionCache}>
      <EuiPage className={styles.guidePage}>
        <EuiPageBody>{children}</EuiPageBody>
      </EuiPage>
    </EuiProvider>
  );
};

export default Chrome;
