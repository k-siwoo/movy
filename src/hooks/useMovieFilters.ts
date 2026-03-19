import { useSearchParams } from "react-router-dom";
import { scenarioLabels, type ScenarioKey } from "../features/movie/scenarios";

function parseScenario(value: string | null): ScenarioKey | undefined {
  if (!value) {
    return undefined;
  }

  const isValid = scenarioLabels.some((item) => item.key === value);
  return isValid ? (value as ScenarioKey) : undefined;
}

export function useMovieFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scenario = parseScenario(searchParams.get("scenario"));
  const language = searchParams.get("lang") || "";
  const ott =
    searchParams
      .get("ott")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  return {
    scenario,
    language,
    ott,
    updateParam,
  };
}
