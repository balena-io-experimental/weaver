import { FC, useEffect, useMemo, useState } from 'react';
import { useSigma } from 'react-sigma-v2';
import { sortBy, values, keyBy, mapValues } from 'lodash';
import { FilePath, FiltersState } from '../types';
import { Panel } from './Panel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faObjectGroup,
	faRectangleXmark,
	faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { ButtonsWrapper, Txt } from '../SharedComponents';

const CaptionList = styled.ul`
	list-style: none;
	padding: 0;
`;

const CaptionRow = styled.li`
	margin-top: 1em;
	input[type='checkbox'] {
		display: none;
	}
	input[type='checkbox']:not(:checked) + label {
		color: var(--dark-grey);
	}
	input[type='checkbox']:not(:checked) + label span[data-type='circle'] {
		background-color: white !important;
	}
	label {
		display: flex;
		flex-direction: row;
		cursor: pointer;
	}
	label:hover {
		opacity: var(--hover-opacity);
	}
	label span[data-type='circle'] {
		flex-shrink: 0;
		display: inline-block;
		width: 1.2em;
		height: 1.2em;
		border-radius: 1.2em;
		vertical-align: middle;
		box-sizing: border-box;
		background-color: var(--dark-grey);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		margin-right: 0.2em;
		transition: var(--transition);
		border: 3px solid var(--dark-grey);
	}
	label span[data-type='node-label'] {
		flex-grow: 1;
	}
	label div[data-type='bar'] {
		position: relative;
		background: var(--light-grey);
		height: 3px;
		margin-bottom: 0.2em;
	}
	label div[data-type='bar'] div[data-type='inside-bar'] {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--dark-grey);
		transition: var(--transition);
	}
`;
const CustomButton = styled.div`
	background: white;
	color: black;
	border: 1px solid black;
	outline: none;
	border-radius: var(--border-radius);
	padding: 0.3em 0.5em;
	font-size: 1em;
	cursor: pointer;
	:hover {
		opacity: var(--hover-opacity);
	}
	> * {
		vertical-align: baseline;
	}
`;

export interface FilePathsPanelProps {
	filePaths: FilePath[];
	filters: FiltersState;
	toggleFilePath: (filePath: string) => void;
	setFilePaths: (filePaths: Record<string, boolean>) => void;
}

export const FilePathsPanel: FC<FilePathsPanelProps> = ({
	filePaths,
	filters,
	toggleFilePath,
	setFilePaths,
}) => {
	const sigma = useSigma();
	const graph = sigma.getGraph();

	const nodesPerFilePath = useMemo(() => {
		const index: Record<string, number> = {};
		graph.forEachNode(
			(_, { filePath }) => (index[filePath] = (index[filePath] || 0) + 1),
		);
		return index;
	}, []);

	const maxNodesPerFilePath = useMemo(
		() => Math.max(...values(nodesPerFilePath)),
		[nodesPerFilePath],
	);
	const visibleFilePathsCount = useMemo(
		() => Object.keys(filters.filePaths).length,
		[filters],
	);

	const [visibleNodesPerFilePath, setVisibleNodesPerFilePath] =
		useState<Record<string, number>>(nodesPerFilePath);
	useEffect(() => {
		// To ensure the graphology instance has up to data "hidden" values for
		// nodes, we wait for next frame before reindexing. This won't matter in the
		// UX, because of the visible nodes bar width transition.
		requestAnimationFrame(() => {
			const index: Record<string, number> = {};
			graph.forEachNode(
				(_, { filePath, hidden }) =>
					!hidden && (index[filePath] = (index[filePath] || 0) + 1),
			);
			setVisibleNodesPerFilePath(index);
		});
	}, [filters]);

	const sortedFilePaths = useMemo(
		() => sortBy(filePaths, (filePath) => -nodesPerFilePath[filePath.key]),
		[filePaths, nodesPerFilePath],
	);

	return (
		<Panel
			title={
				<>
					<FontAwesomeIcon icon={faObjectGroup} />
					<label style={{ marginLeft: 3 }}>File paths</label>
					{visibleFilePathsCount < filePaths.length ? (
						<Txt muted small>
							{' '}
							({visibleFilePathsCount} / {filePaths.length})
						</Txt>
					) : (
						''
					)}
				</>
			}
		>
			<p>
				<Txt italic muted>
					Click a file path to show/hide related files and imports.
				</Txt>
			</p>
			<ButtonsWrapper>
				<CustomButton
					onClick={() =>
						setFilePaths(mapValues(keyBy(filePaths, 'key'), () => true))
					}
				>
					<FontAwesomeIcon icon={faSquareCheck} /> Check all
				</CustomButton>{' '}
				<CustomButton onClick={() => setFilePaths({})}>
					<FontAwesomeIcon icon={faRectangleXmark} /> Uncheck all
				</CustomButton>
			</ButtonsWrapper>
			<CaptionList>
				{sortedFilePaths.map((filePath) => {
					const nodesCount = nodesPerFilePath[filePath.key];
					const visibleNodesCount = visibleNodesPerFilePath[filePath.key] || 0;
					return (
						<CaptionRow
							key={filePath.key}
							title={`${nodesCount} page${nodesCount > 1 ? 's' : ''}${
								visibleNodesCount !== nodesCount
									? ` (only ${visibleNodesCount} visible)`
									: ''
							}`}
						>
							<input
								type="checkbox"
								checked={filters.filePaths[filePath.key] || false}
								onChange={() => toggleFilePath(filePath.key)}
								id={`filePath-${filePath.key}`}
							/>
							<label htmlFor={`filePath-${filePath.key}`}>
								<span
									data-type="circle"
									style={{
										background: filePath.color,
										borderColor: filePath.color,
									}}
								/>{' '}
								<div data-type="node-label">
									<span>{filePath.filePathLabel}</span>
									<div
										data-type="bar"
										style={{
											width:
												((100 * nodesCount) / maxNodesPerFilePath || 0) + '%',
										}}
									>
										<div
											data-type="inside-bar"
											style={{
												width:
													((100 * visibleNodesCount) / nodesCount || 0) + '%',
											}}
										/>
									</div>
								</div>
							</label>
						</CaptionRow>
					);
				})}
			</CaptionList>
		</Panel>
	);
};
