
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
  let data = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
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