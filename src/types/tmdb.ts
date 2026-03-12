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

export interface ReleaseDateItem {
  certification: string;
  iso_639_1: string | null;
  note: string;
  release_date: string;
  type: number;
}

export interface ReleaseDateCountry {
  iso_3166_1: string;
  release_dates: ReleaseDateItem[];
}

export interface MovieReleaseDatesResponse {
  id: number;
  results: ReleaseDateCountry[];
}
