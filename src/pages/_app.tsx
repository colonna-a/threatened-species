import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { EuiErrorBoundary } from '@elastic/eui';
import './app.scss';
import { Provider } from '../components/provider';
import dynamic from 'next/dynamic';
const Chrome = dynamic(() => import('../components/chrome'), { ssr: false });

/**
 * Next.js uses the App component to initialize pages. You can override it
 * and control the page initialization. Here use use it to render the
 * `Chrome` component on each page, and apply an error boundary.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
const EuiApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Threatened Species</title>
      <meta name="description" content="Red List of Threatened Species" />
    </Head>
    <Provider>
      <Chrome>
        <EuiErrorBoundary>
          <Component {...pageProps} />
        </EuiErrorBoundary>
      </Chrome>
    </Provider>
  </>
);

export default EuiApp;
