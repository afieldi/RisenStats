import fetch, { Headers } from "node-fetch";
import logger from "../../logger";

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(errorMsg: string, status: number, apiMessage: string) {
    super(errorMsg);
    this.status = status;
    this.message = apiMessage;
  }
}

async function _MakeAPICall<T>(url: string, method: string, body?: any): Promise<T>
{
  // const headers: HeadersInit = new Headers();
  // headers.set('Content-Type', 'application/json');
  // headers.set('X-Riot-Token', process.env.RIOT_API_KEY as string);
  let headers = {
    'Content-Type': 'application/json',
    'X-Riot-Token': process.env.RIOT_API_KEY as string,
  };

  logger.debug(`Making API call to ${url}`);

  return fetch(url, {
    method: method,
    headers,
    body: JSON.stringify(body)
  }).then(async (response: any) => {
    if (response.ok) {
      return response.json();
    }
    else if (response.status === 429) {
        await setTimeout(() => {
        }, 2000);
        return await _MakeAPICall(url, method, body)
    }
    else {
      const responseText = await response.json();
      throw new ApiError(`API call failed. Input: ${JSON.stringify(body)} Output: ${JSON.stringify(responseText)} Headers: ${JSON.stringify(headers)}`, response.status, responseText);
    }
  }, (err: any) => {
    throw new Error(err);
  })
}

function GetHost(endpoint: string): string
{
  if (endpoint.startsWith("/lol/tournament") || endpoint.startsWith("/lol/match/v5"))
  {
    // americas.
    return process.env.RIOT_API_URL_1 as string;
  }
  // na1.
  return process.env.RIOT_API_URL_2 as string;
}

export async function MakeTournamentRiotAPICall<T>(endpoint: string, method: string, body?: any): Promise<T>
{
  if (method !== "POST" && method !== "GET")
  {
    throw new Error(`Invalid method ${method}`);
  }
  const url = process.env.RIOT_API_URL_1 + endpoint;
  return await _MakeAPICall<T>(url, method, body);
}

export async function MakeRiotAPICall<T>(endpoint: string, method: string, body?: any): Promise<T>
{
  if (method !== "GET")
  {
    throw new Error(`Invalid method ${method}`);
  }
  const url = GetHost(endpoint) + endpoint;
  return await _MakeAPICall<T>(url, method, body);
}