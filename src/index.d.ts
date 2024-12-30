// Fool TypeScript into thinking that we actually have typings for these components.
// This will tell typescript that anything from this module is of type any.

declare module '*.png';
declare module '*.svg';

// Declare configuration globals here so that TypeScript compiles
/* eslint-disable-next-line no-var */
declare var UI_BUILD_INFO;
