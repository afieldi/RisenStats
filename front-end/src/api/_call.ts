import Cookies from 'universal-cookie';
import { AUTH_COOKIE_KEY } from '../common/constants';

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(errorMsg: string, status: number, apiMessage: string) {
    super(errorMsg);
    this.status = status;
    this.message = apiMessage;
  }
}

export async function MakeBackendCall<T>(url: string, method: string, body: T, json: boolean = true): Promise<{}> {
  url = process.env.REACT_APP_BACKEND_URL + url;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const authToken = new Cookies().get(AUTH_COOKIE_KEY);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  let data = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body)
  });

  if (data.ok === false) {
    throw new ApiError(`An error occured calling ${url}`, data.status, await data.text());
  }

  if (json) {
    return (await data.json());
  }
  return (await data.text());
}