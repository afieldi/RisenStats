import ProviderModel from "../../models/provider.model";

export interface GetProviderResponse {
  proivders: ProviderModel[];
}

export interface CreateProviderRequest {
  region: string;
  callback: string;
}

export interface CreateProviderResponse {
  provider: ProviderModel;
}