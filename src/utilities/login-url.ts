// external login URL, assuming UI_EXETRNAL_LOGIN_URI and featureFlags.external_authentication are set
export const loginURL = (next) => {
  if (next) {
    const fullPath = `${UI_BASE_PATH}/${next}`.replaceAll(/\/+/g, '/');
    return `${UI_EXTERNAL_LOGIN_URI}?next=${encodeURIComponent(fullPath)}`;
  }

  return UI_EXTERNAL_LOGIN_URI;
};
