export interface AuthenticatedRequest {
    auth: string
}

export interface BuyStockRequest extends AuthenticatedRequest {
    seasonId: number;
    teamId: number;
    howMany: number;
}

export interface BuyStockResponse {
    teamId: number,
    howManyBought: number,
}


export interface SellStockResponse {
    teamId: number,
    howManyBought: number,
}

export interface SellStockRequest extends AuthenticatedRequest {
    seasonId: number;
    teamId: number;
    howMany: number;
}

export interface GetPortfolioRequest extends  AuthenticatedRequest {
}

export interface GetPortfolioResponse {
    portfolio: Map<number, number>
}

export interface GetStockTimelineResponse {
    timeline: { [k: number]: StockTimelineEntry[]; }
}

export interface StockTimelineEntry {
    value: number,
    timestamp: Date,
}