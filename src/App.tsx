import { useEffect, useState } from "react";
import { getRepo } from "./utils/github";
import { clean, cloneRepo, getRepoInfo } from "./utils/requests";
import { Dataset, FiltersState } from "./types";
import { SigmaContainer, ZoomControl, FullScreenControl } from "react-sigma-v2";
import { GraphEventsController } from "./GraphComponents/GraphEventsController";
import { GraphDataController } from "./GraphComponents/GraphDataController";
import { GraphSettingsController } from "./GraphComponents/GraphSettingsController";
import "react-sigma-v2/lib/react-sigma-v2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faCrosshairs, faExpand, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { GraphTitle } from "./GraphComponents/GraphTitle";
import { SearchField } from "./GraphComponents/SearchField";
// import { DescriptionPanel } from "./GraphComponents/DescriptionPanel";
import { ClustersPanel } from "./GraphComponents/ClustersPanel";
import omit from "lodash/omit";
import drawLabel from "./utils/canvas-utils";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { constant, keyBy, mapValues } from "lodash";
import styled from "styled-components";

const Controls = styled.div`
  position: absolute;
  bottom: var(--stage-padding);
  left: var(--stage-padding);

  div > button {
		display: block;
		position: relative;
		font-size: 1.8em;
		width: 2em;
		height: 2em;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		color: black;
		background: white;
		border: none;
		outline: none;
		margin-top: 0.2em;
		cursor: pointer;
	}
	div > button:hover {
		color: var(--dark-grey);
	}
	div > button > * {
		position: absolute;
		inset: 0;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
`

const Panels = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 350px;
  max-height: calc(100vh - 2 * var(--stage-padding));
  overflow-y: auto;
  padding: var(--stage-padding);
  scrollbar-width: thin;
`

export const App = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [data, setData] = useState<Dataset | undefined>();
  const [repoName, setRepoName] = useState<string>();
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
  });

  useEffect(() => {
    getRepo("balena-io", "balena-sdk").then((repo) => {
      setRepoName(repo.data.name);
      cloneRepo(repo.data.clone_url).then((repoInfo) => 
        getRepoInfo().then((res) => {
          setData(res.data)
          setFiltersState({
            clusters: mapValues(keyBy(res.data.clusters, "key"), constant(true))
          });
        })
      )
    });
    return () => {
      clean();
    };
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div id="app-root">
      <SigmaContainer
        graphOptions={{ type: "directed" }}
        initialSettings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        <GraphDataController dataset={data} filters={filtersState} />

        {!!data && (
          <>
            <Controls>
              <FullScreenControl
                customEnterFullScreen={<FontAwesomeIcon icon={faExpand} />}
                customExitFullScreen={<FontAwesomeIcon icon={faCompress} />}
              />
              <ZoomControl
                customZoomIn={<FontAwesomeIcon icon={faMagnifyingGlassPlus} />}
                customZoomOut={<FontAwesomeIcon icon={faMagnifyingGlassMinus} />}
                customZoomCenter={<FontAwesomeIcon icon={faCrosshairs} />}
              />
            </Controls>
            <div>
              <GraphTitle filters={filtersState} title={repoName} />
              <Panels>
                <SearchField filters={filtersState} />
                {/* <DescriptionPanel /> */}
                <ClustersPanel
                  clusters={data.clusters}
                  filters={filtersState}
                  setClusters={(clusters) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters,
                    }))
                  }
                  toggleCluster={(cluster) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters: filters.clusters[cluster]
                        ? omit(filters.clusters, cluster)
                        : { ...filters.clusters, [cluster]: true },
                    }));
                  }}
                />
              </Panels>
            </div>
          </>
        )}
      </SigmaContainer>
    </div>
  );
};
