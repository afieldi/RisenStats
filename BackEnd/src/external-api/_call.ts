import fetch, { Headers } from 'node-fetch';
import logger from '../../logger';

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(errorMsg: string, status: number, apiMessage: string) {
    super(errorMsg);
    this.status = status;
    this.message = apiMessage;
  }
}

const MAX_RATE_LIMIT_RETRIES = 5;
const DEFAULT_RETRY_AFTER_MS = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function _MakeAPICall<T>(url: string, method: string, body?: any, attempt: number = 0): Promise<T> {
  // Never log or embed these headers in errors, they contain the API key.
  const headers = {
    'Content-Type': 'application/json',
    'X-Riot-Token': process.env.RIOT_API_KEY
  };

  logger.debug(`Making API call to ${url}`);

  return await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body)
  }).then(async(response: any) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
      const retryAfterSeconds = Number(response.headers.get('retry-after'));
      const waitMs = retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : DEFAULT_RETRY_AFTER_MS * (attempt + 1);
      logger.debug(`Rate limited, waiting ${waitMs}ms (attempt ${attempt + 1}/${MAX_RATE_LIMIT_RETRIES})`);
      await sleep(waitMs);
      return await _MakeAPICall<T>(url, method, body, attempt + 1);
    } else {
      const rawText = await response.text();
      let responseText: any = rawText;
      try {
        responseText = JSON.parse(rawText);
      } catch (e) {}
      logger.error(`API call failed. Code: ${response.status} Url: ${url} Input: ${JSON.stringify(body)} Output: ${JSON.stringify(responseText)}`);
      throw new ApiError(`API call failed. Code: ${response.status} Url: ${url} Input: ${JSON.stringify(body)} Output: ${JSON.stringify(responseText)}`, response.status, responseText);
    }
  }, (err: any) => {
    throw new Error(err);
  });
}

function GetHost(endpoint: string): string {
  if (endpoint.startsWith('/lol/tournament') || endpoint.startsWith('/lol/match/v5') || endpoint.startsWith('/riot/account/v1')) {
    // americas.
    return process.env.RIOT_API_URL_1;
  }
  // na1.
  return process.env.RIOT_API_URL_2;
}

export async function MakeTournamentRiotAPICall<T>(endpoint: string, method: string, body?: any): Promise<T> {
  if (method !== 'POST' && method !== 'GET') {
    throw new Error(`Invalid method ${method}`);
  }
  const url = process.env.RIOT_API_URL_1 + endpoint;
  return await _MakeAPICall<T>(url, method, body);
}

export async function MakeRiotAPICall<T>(endpoint: string, method: string, body?: any): Promise<T> {
  if (method !== 'GET') {
    throw new Error(`Invalid method ${method}`);
  }
  const url = GetHost(endpoint) + endpoint;
  return await _MakeAPICall<T>(url, method, body);
}

export async function MakeGeneralAPICall<T>(url: string, method: string, body?: any): Promise<T> {
  return _MakeAPICall(url, method, body);
}
