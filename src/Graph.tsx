import { FC, useEffect, useState } from 'react';
import { SigmaContainer, ZoomControl, FullScreenControl } from 'react-sigma-v2';
import { GraphEventsController } from './GraphComponents/GraphEventsController';
import { GraphDataController } from './GraphComponents/GraphDataController';
import { GraphSettingsController } from './GraphComponents/GraphSettingsController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCompress,
	faCrosshairs,
	faExpand,
	faMagnifyingGlassMinus,
	faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons';
import { GraphTitle } from './GraphComponents/GraphTitle';
import { SearchField } from './GraphComponents/SearchField';
import { DescriptionPanel } from './GraphComponents/DescriptionPanel';
import { FilePathsPanel } from './GraphComponents/FilePathsPanel';
import omit from 'lodash/omit';
import drawLabel from './utils/canvas-utils';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { clean } from './utils/requests';
import styled from 'styled-components';
import 'react-sigma-v2/lib/react-sigma-v2.css';
import { Dataset, FiltersState } from './types';
import { OnlyOrhpanToggle } from './GraphComponents/OnlyOrphansToggle';

const Wrapper = styled.div`
	height: calc(100% - 38px);
	width: 100%;
`;

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
`;

const Panels = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	width: var(--panels-width);
	max-height: calc(100vh - 42 * var(--stage-padding));
	overflow-y: auto;
	padding: var(--stage-padding);
	scrollbar-width: thin;
`;

interface GraphProps {
	data: Dataset;
	repositoryName: string;
	groupBy: string;
	filtersState: FiltersState;
	onBackClick: () => void;
	setFiltersState: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export const Graph: FC<GraphProps> = ({
	data,
	repositoryName,
	groupBy,
	filtersState,
	onBackClick,
	setFiltersState,
}) => {
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			clean();
		};
	}, []);

	return (
		<Wrapper>
			<SigmaContainer
				graphOptions={{ type: 'directed' }}
				initialSettings={{
					nodeProgramClasses: { image: getNodeProgramImage() },
					labelRenderer: drawLabel,
					defaultNodeType: 'image',
					defaultEdgeType: 'arrow',
					labelDensity: 0.07,
					labelGridCellSize: 60,
					labelRenderedSizeThreshold: 15,
					labelFont: 'Lato, sans-serif',
					zIndex: true,
				}}
				className="react-sigma"
			>
				<GraphSettingsController hoveredNode={hoveredNode} />
				<GraphEventsController setHoveredNode={setHoveredNode} />
				<GraphDataController dataset={data} filters={filtersState} />

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
						<GraphTitle
							filters={filtersState}
							title={repositoryName}
							groupBy={groupBy}
							onBackClick={() => onBackClick()}
						/>
						<Panels>
							<SearchField filters={filtersState} />
							<OnlyOrhpanToggle
								filters={filtersState}
								toggleOnlyOrphans={(value: boolean) => {
									setFiltersState({ ...filtersState, onlyOrphans: value });
								}}
							/>
							<FilePathsPanel
								filePaths={data.filePaths}
								filters={filtersState}
								setFilePaths={(filePaths) =>
									setFiltersState((filters) => ({
										...filters,
										filePaths,
									}))
								}
								toggleFilePath={(filePath) => {
									setFiltersState((filters) => ({
										...filters,
										filePaths: filters.filePaths[filePath]
											? omit(filters.filePaths, filePath)
											: { ...filters.filePaths, [filePath]: true },
									}));
								}}
							/>
							<DescriptionPanel />
						</Panels>
					</div>
				</>
			</SigmaContainer>
		</Wrapper>
	);
};
