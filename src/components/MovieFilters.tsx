import styled from "@emotion/styled";
import { scenarioLabels, type ScenarioKey } from "../features/movie/scenarios";

const ottOptions = [
  { key: "", label: "전체" },
  { key: "8", label: "Netflix" },
  { key: "97", label: "Watcha" },
  { key: "337", label: "Disney+" },
  { key: "350", label: "TVING" },
  { key: "356", label: "wavve" },
];

const FilterGroup = styled.div`
  display: grid;
  gap: 12px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.button<{ active: boolean }>`
  border-radius: 999px;
  border: 1px solid ${({ active }) => (active ? "rgba(242, 191, 89, 0.45)" : "var(--border)")};
  background: ${({ active }) => (active ? "rgba(242, 191, 89, 0.12)" : "var(--panel)")};
  color: ${({ active }) => (active ? "var(--accent)" : "var(--muted)")};
  padding: 10px 16px;
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    color 150ms ease,
    transform 150ms ease,
    background 150ms ease;

  &:hover {
    color: var(--text);
    border-color: rgba(242, 191, 89, 0.28);
    transform: translateY(-1px);
  }
`;

const OttChip = styled(Chip)`
  border-radius: 10px;
  padding: 10px 14px;
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const SelectWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.95rem;
`;

const Select = styled.select`
  height: 40px;
  min-width: 104px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  padding: 0 12px;
  outline: none;
  color-scheme: dark;

  &:focus {
    border-color: rgba(242, 191, 89, 0.45);
    box-shadow: 0 0 0 3px rgba(242, 191, 89, 0.12);
  }

  option {
    background: var(--panel);
    color: var(--text);
  }
`;

interface MovieFiltersProps {
  scenario?: ScenarioKey;
  language: string;
  ott: string[];
  onUpdateParam: (key: string, value?: string) => void;
}

export function MovieFilters({
  scenario,
  language,
  ott,
  onUpdateParam,
}: MovieFiltersProps) {
  return (
    <FilterGroup>
      <ChipRow>
        {scenarioLabels.map((item) => (
          <Chip
            key={item.key}
            type="button"
            active={item.key === scenario}
            onClick={() => onUpdateParam("scenario", item.key === scenario ? undefined : item.key)}
          >
            {item.label}
          </Chip>
        ))}
      </ChipRow>

      <ChipRow>
        {ottOptions.map((item) => (
          <OttChip
            key={item.key || "all"}
            type="button"
            active={item.key === "" ? ott.length === 0 : ott.includes(item.key)}
            onClick={() => {
              if (item.key === "") {
                onUpdateParam("ott", undefined);
                return;
              }

              const next = ott.includes(item.key)
                ? ott.filter((value) => value !== item.key)
                : [...ott, item.key];

              onUpdateParam("ott", next.length ? next.join(",") : undefined);
            }}
          >
            {item.label}
          </OttChip>
        ))}
      </ChipRow>

      <ControlRow>
        <SelectWrap htmlFor="language">
          <span>언어</span>
          <Select
            id="language"
            value={language}
            onChange={(event) => onUpdateParam("lang", event.target.value || undefined)}
          >
            <option value="">전체</option>
            <option value="ko">한국어</option>
            <option value="en">영어</option>
            <option value="ja">일본어</option>
          </Select>
        </SelectWrap>
      </ControlRow>
    </FilterGroup>
  );
}
