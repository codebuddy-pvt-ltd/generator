import fetch, { Headers } from 'node-fetch';
import { getToken } from './getToken';

const API_URL = 'http://localhost:3000';

/**
 * Generate HTTP headers
 */
const getHeader = async (headers = new Headers(), hasFiles = false): Promise<Headers> => {
  const defaultHeaders = new Headers();
  defaultHeaders.append('Accept', 'application/json');
  defaultHeaders.append('Content-Type', 'application/json');

  if (headers) {
    headers.forEach((value: string, key: string) => defaultHeaders.append(key, value));
  }

  if (hasFiles) {
    defaultHeaders.delete('Content-Type');
  }

  defaultHeaders.append('Authorization', `Bearer ${await getToken()}`);

  return defaultHeaders;
};

/**
 * Generate HTTP body
 */
// eslint-disable-next-line no-undef
const getBody = (body?: BodyInit, hasFiles = false) => (hasFiles ? body : JSON.stringify(body));

export class ApiResponseError extends Error {
  code = 400;

  constructor(message: string, code = 400) {
    super(message || 'Oops! Something went wrong');
    this.name = 'ApiResponseError';
    this.code = code;
  }
}

type ErrorResponse = {
  message?: string;
  code?: number;
};

/**
 * Handle HTTP error
 */
const handleError = (httpStatusCode: number, response: ErrorResponse) => {
  if (!/^(2|3)[0-9][0-9]$/.test(String(httpStatusCode))) {
    throw new ApiResponseError(
      response?.message || 'Something went wrong!!',
      httpStatusCode ?? 501,
    );
  }
};

/**
 * Generate Request URL
 */
const getURL = (url: string, options: { baseURL?: string; isMockedURL?: boolean }) => {
  const baseURL = options?.baseURL ? options.baseURL : API_URL;
  return baseURL + url;
};

type HTTPOptions = {
  baseURL?: string;
  isMockedURL?: boolean;
  headers?: Headers;
  hasFiles?: boolean;
};

/**
 * HTTP GET Request
 */
const fetchGet = async <T extends ErrorResponse>(
  url: string,
  options?: HTTPOptions,
  isDownloadingData?: boolean,
) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'GET',
      headers: await getHeader(options?.headers),
    },
  );

  const response: T = isDownloadingData ? await result.text() : await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP POST Request
 */
const fetchPost = async <T extends ErrorResponse>(
  url: string,
  body?: any,
  options?: HTTPOptions,
) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'POST',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP PATCH Request
 */
const fetchPatch = async <T extends ErrorResponse>(
  url: string,
  body?: any,
  options?: HTTPOptions,
) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'PATCH',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP PUT Request
 */
const fetchPut = async <T extends ErrorResponse>(
  url: string,
  body?: any,
  options?: HTTPOptions,
) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'PUT',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP DELETE Request
 */
const fetchDelete = async <T extends ErrorResponse>(
  url: string,
  body?: any,
  options?: HTTPOptions,
) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'DELETE',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

const http = {
  get: fetchGet,
  post: fetchPost,
  put: fetchPut,
  patch: fetchPatch,
  delete: fetchDelete,
};

export default http;
