/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { env } from 'process';

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
}

/**
 * Handles the clarity tag injection (Experimental usage)
 */
export default function handleClarity() {
  const tag = env.CLARITY_TAG;

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
