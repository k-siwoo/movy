export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
}

export interface ProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface CountryProviders {
  link?: string;
  flatrate?: ProviderItem[];
  rent?: ProviderItem[];
  buy?: ProviderItem[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, CountryProviders>;
}
