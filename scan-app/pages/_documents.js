import * as React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
// Fluent UI React 8+
import { Stylesheet, InjectionMode, resetIds } from '@fluentui/react';
// Fluent UI React (Fabric) 7 or earlier
// import { Stylesheet, InjectionMode, resetIds } from 'office-ui-fabric-react/lib/Utilities';

// Do this in file scope to initialize the stylesheet before Fluent UI React components are imported.
const stylesheet = Stylesheet.getInstance();

// Set the config.
stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: 'server',
});

// Now set up the document, and just reset the stylesheet.
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    stylesheet.reset();
    resetIds();

    const page = renderPage((App) => (props) => <App {...props} />);

    return { ...page, styleTags: stylesheet.getRules(true) };
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: this.props.styleTags }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
