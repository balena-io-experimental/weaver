import { KeyboardEvent, ChangeEvent, FC, useEffect, useState } from "react";
import { useSigma } from "react-sigma-v2";
import { Attributes } from "graphology-types";
import { FiltersState } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const SearchContainer = styled.div`
  position: relative;
  input[type="search"] {
    width: calc(100%);
    height: 3em;
    box-shadow: var(--shadow);
    border: none;
    outline: none;
    border-radius: var(--border-radius);
    margin-bottom: 0.5em;
    padding: 1em 1em 1em 3em;
    font-family: Lato, sans-serif;
    font-size: 1em;
  }
  svg {
    position: absolute;
    width: 1em;
    height: 1em;
    top: 1em;
    left: 1em;
  }
`

export interface SearchFieldProps { 
  filters: FiltersState 
}

export const SearchField: FC<SearchFieldProps> = ({ filters }) => {
  const sigma = useSigma();

  const [search, setSearch] = useState<string>("");
  const [values, setValues] = useState<Array<{ id: string; label: string }>>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const refreshValues = () => {
    const newValues: Array<{ id: string; label: string }> = [];
    const lcSearch = search.toLowerCase();
    if (!selected && search.length > 1) {
      sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
        if (!attributes.hidden && attributes.label && attributes.label.toLowerCase().includes(lcSearch) && !newValues.some(n => n.label === attributes.label))
          newValues.push({ id: key, label: attributes.label });
      });
    }
    setValues(newValues);
  };

  // Refresh values when search is updated:
  useEffect(() => refreshValues(), [search]);

  // Refresh values when filters are updated (but wait a frame first):
  useEffect(() => {
    requestAnimationFrame(refreshValues);
  }, [filters]);

  useEffect(() => {
    if (!selected) return;

    sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
    const nodeDisplayData = sigma.getNodeDisplayData(selected);

    if (nodeDisplayData)
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        },
      );

    return () => {
      sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
    };
  }, [selected]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    const valueItem = values.find((value) => value.label.includes(searchString));
    if (valueItem) {
      setSearch(valueItem.label);
      setValues([]);
      setSelected(valueItem.id);
    } else {
      setSelected(null);
      setSearch(searchString);
    }
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && values.length) {
      setSearch(values[0].label);
      setSelected(values[0].id);
    }
  };

  return (
    <SearchContainer>
      <input
        type="search"
        placeholder="Search in nodes..."
        list="nodes"
        value={search}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
      />
      <FontAwesomeIcon icon={faSearch} />
      <datalist id="nodes">
        {values.map((value: { id: string; label: string }) => (
          <option key={value.id} value={value.label}>
            {value.label}
          </option>
        ))}
      </datalist>
    </SearchContainer>
  );
};
