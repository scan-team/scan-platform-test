//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is the _document.js file that overrides the basic document provided 
//              by next.js and allows a bit more complex and customizable control.
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: ReactJS, head, html, main and nextscript from Next.js, 
//             3rd partiy libraries: fluentui
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import * as React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Stylesheet, InjectionMode, resetIds } from '@fluentui/react';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Initiation configs
//------------------------------------------------------------------------------------------------
// Do this in file scope to initialize the stylesheet before Fluent UI React components are imported.
const stylesheet = Stylesheet.getInstance();

// Set the config.
stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: 'server',
});

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// My Document Page 
// Set up the document, and just reset the stylesheet.
//------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------
