import ProviderModel from "../../models/provider.model";

export interface GetProvidersResponse {
  proivders: ProviderModel[];
}

export interface CreateProviderRequest {
  region: string;
  callback: string;
}

export interface CreateProviderResponse {
  provider: ProviderModel;
}