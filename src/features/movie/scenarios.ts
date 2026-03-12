export type ScenarioKey =
  | "sad"
  | "dopamine"
  | "friends"
  | "family"
  | "solo"
  | "rainy"
  | "insomnia"
  | "postExam";

export interface DiscoverParams {
  include_adult: boolean;
  sort_by: string;
  page: number;
  with_original_language?: string;
  with_watch_providers?: string;
  watch_region?: string;
  region?: string;
  with_release_type?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
}

const scenarioPresets: Record<ScenarioKey, Partial<DiscoverParams>> = {
  sad: {
    sort_by: "vote_average.desc",
    "vote_average.gte": 7.2,
    "vote_count.gte": 300,
    "with_runtime.gte": 90,
    "with_runtime.lte": 140,
  },
  dopamine: {
    sort_by: "popularity.desc",
    "vote_average.gte": 6.3,
    "vote_count.gte": 800,
    "with_runtime.gte": 85,
    "with_runtime.lte": 130,
    "primary_release_date.gte": "2010-01-01",
  },
  friends: {
    sort_by: "popularity.desc",
    "vote_average.gte": 6.0,
    "vote_count.gte": 1200,
    "with_runtime.gte": 85,
    "with_runtime.lte": 130,
    "primary_release_date.gte": "2005-01-01",
  },
  family: {
    sort_by: "popularity.desc",
    "vote_average.gte": 6.5,
    "vote_count.gte": 500,
    "with_runtime.gte": 80,
    "with_runtime.lte": 120,
  },
  solo: {
    sort_by: "vote_average.desc",
    "vote_average.gte": 7.0,
    "vote_count.gte": 200,
    "with_runtime.gte": 95,
    "with_runtime.lte": 150,
  },
  rainy: {
    sort_by: "vote_average.desc",
    "vote_average.gte": 6.8,
    "vote_count.gte": 250,
    "with_runtime.gte": 90,
    "with_runtime.lte": 140,
  },
  insomnia: {
    sort_by: "popularity.desc",
    "vote_average.gte": 6.5,
    "vote_count.gte": 500,
    "with_runtime.gte": 80,
    "with_runtime.lte": 110,
  },
  postExam: {
    sort_by: "popularity.desc",
    "vote_average.gte": 6.2,
    "vote_count.gte": 700,
    "with_runtime.gte": 85,
    "with_runtime.lte": 130,
    "primary_release_date.gte": "2010-01-01",
  },
};

export const scenarioLabels: { key: ScenarioKey; label: string }[] = [
  { key: "sad", label: "우울할 때" },
  { key: "dopamine", label: "도파민" },
  { key: "friends", label: "친구와 함께" },
  { key: "family", label: "가족과 함께" },
  { key: "solo", label: "혼자서" },
  { key: "rainy", label: "비 오는 날" },
  { key: "insomnia", label: "잠 안 올 때" },
  { key: "postExam", label: "시험 끝난 후" },
];

export interface DiscoverFilterInput {
  page: number;
  scenario?: ScenarioKey;
  language?: string;
  adult?: boolean;
  ott?: string[];
  country?: string;
}

// Discover 요청 파라미터 생성 함수
export function buildDiscoverParams(
  input: DiscoverFilterInput,
): DiscoverParams {
  const base: DiscoverParams = {
    include_adult: false,
    sort_by: "popularity.desc",
    page: input.page,
  };

  const withScenario = input.scenario
    ? { ...base, ...scenarioPresets[input.scenario] }
    : base;

  return {
    ...withScenario,
    include_adult: input.adult ?? withScenario.include_adult,
    with_original_language: input.language || undefined,
    with_watch_providers: input.ott?.length ? input.ott.join("|") : undefined,
    watch_region: input.ott?.length ? "KR" : undefined,
    region: input.country || undefined,
    page: input.page,
  };
}
