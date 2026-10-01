enum ALLOWED_CONTENT_TYPES {
  JSON = 'application/json',
  MERGE_PATCH = 'application/merge-patch+json',
}

/**
 * Sets Content-Type header to selected allowed value.
 * @param {Headers} headers Request headers.
 * @param {ALLOWED_CONTENT_TYPES} type Allowed content types.
 * @returns {void} Sets Content-Type header to selected allowed value.
 */
const setContentType = (headers: Headers, type: ALLOWED_CONTENT_TYPES): void =>
  headers.set('Content-Type', type);

/**
 * Builds headers for a request, deferring to any the caller has already set.
 * @param {RequestInit} options Initial Request options.
 * @returns {Headers} Returns request headers.
 */
function defineHeaders(options: RequestInit): Headers {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    if (options.method === 'PATCH') {
      setContentType(headers, ALLOWED_CONTENT_TYPES.MERGE_PATCH);
    } else if (options.body !== undefined) {
      setContentType(headers, ALLOWED_CONTENT_TYPES.JSON);
    }
  }

  return headers;
}

/**
 * Reads and parses a response body based on its Content-Type or Status Code.
 * @param {Response} res Response to read.
 * @returns {unknown} The parsed JSON body, raw test for non-JSON or undefined.
 */
function getBody(res: Response): unknown {
  if (res.status === 204) {
    return undefined;
  }

  const contentType = res.headers.get('content-type');

  if (!contentType) {
    throw new Error('Response missing Content-Type header');
  }

  if (contentType.includes(ALLOWED_CONTENT_TYPES.JSON)) {
    return res.json();
  }
  return res.text();
}

/**
 * Builds an Error returning the response status and parsed body for a failed request.
 * @param {number} status HTTP Status code.
 * @param {unknown} data Parsed response body.
 * @returns {Error & { status: number; data: unknown }} Error with status and reponse body attached.
 */
function buildResponseError(status: number, data: unknown): Error {
  return Object.assign(new Error(`Request failed with status ${status}`), {
    status,
    data,
  });
}

/**
 * Custom Pulp Orval mutator. Sends all API Requests with the expected request options and returns the parsed response.
 * @param {string} url Request URL.
 * @param {RequestInit} options Request Fetch Options.
 * @returns {Promise<T>} Parsed response body on success.
 */
async function pulpFetch<T>(url: string, options: RequestInit): Promise<T> {
  const headers = defineHeaders(options);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await getBody(response);

  if (!response.ok) {
    throw buildResponseError(response.status, data);
  }

  return data as Promise<T>;
}

export { pulpFetch };
