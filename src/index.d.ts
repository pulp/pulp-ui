// Fool TypeScript into thinking that we actually have typings for these components.
// This will tell typescript that anything from this module is of type any.

declare module '*.png';
declare module '*.svg';

// Declare configuration globals here so that TypeScript compiles
/* eslint-disable no-var */
declare var APPLICATION_NAME;
declare var UI_BUILD_INFO;
declare var UI_DOCS_URL;
