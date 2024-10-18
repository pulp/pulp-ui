import { config } from 'src/ui-config';

// external login URL, assuming UI_EXETRNAL_LOGIN_URI is set
export const loginURL = (next) => {
  const { UI_BASE_PATH, UI_EXTERNAL_LOGIN_URI } = config;

  if (next) {
    const fullPath = `${UI_BASE_PATH}/${next}`.replaceAll(/\/+/g, '/');
    return `${UI_EXTERNAL_LOGIN_URI}?next=${encodeURIComponent(fullPath)}`;
  }

  return UI_EXTERNAL_LOGIN_URI;
};
