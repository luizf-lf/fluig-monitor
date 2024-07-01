/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */

import log from 'electron-log';

/**
 * Injects the google analytics tag (Experimental usage)
 * @see https://analytics.google.com/
 */
export function injectGA() {
  const tag: string = ''; // your google analytics tag should go here

  if (tag && tag.length > 0) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', tag);

    log.info(`Google Analytics injected with tag ${tag}`);
  }
}

function injectClarity(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = `https://www.clarity.ms/tag/${i}`;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);

  log.info(`Clarity injected with tag ${i}`);
}

/**
 * Handles the clarity tag injection (Experimental usage)
 * @see https://clarity.microsoft.com/
 */
export function handleClarity() {
  const tag: string = ''; // your clarity tag should go here

  if (tag && tag.length > 0) {
    injectClarity(
      window,
      document,
      'clarity',
      'script',
      tag,
      undefined,
      undefined
    );
  }
}
