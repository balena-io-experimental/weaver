import { FC, useEffect, useMemo, useState } from 'react';
import { useSigma } from 'react-sigma-v2';
import { sortBy, values, keyBy, mapValues } from 'lodash';
import { Cluster, FiltersState } from '../types';
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
	font-family: Lato, sans-serif;
	cursor: pointer;
	:hover {
		opacity: var(--hover-opacity);
	}
	> * {
		vertical-align: baseline;
	}
`;

export interface ClustersPanelProps {
	clusters: Cluster[];
	filters: FiltersState;
	toggleCluster: (cluster: string) => void;
	setClusters: (clusters: Record<string, boolean>) => void;
}

export const ClustersPanel: FC<ClustersPanelProps> = ({
	clusters,
	filters,
	toggleCluster,
	setClusters,
}) => {
	const sigma = useSigma();
	const graph = sigma.getGraph();

	const nodesPerCluster = useMemo(() => {
		const index: Record<string, number> = {};
		graph.forEachNode(
			(_, { cluster }) => (index[cluster] = (index[cluster] || 0) + 1),
		);
		return index;
	}, []);

	const maxNodesPerCluster = useMemo(
		() => Math.max(...values(nodesPerCluster)),
		[nodesPerCluster],
	);
	const visibleClustersCount = useMemo(
		() => Object.keys(filters.clusters).length,
		[filters],
	);

	const [visibleNodesPerCluster, setVisibleNodesPerCluster] =
		useState<Record<string, number>>(nodesPerCluster);
	useEffect(() => {
		// To ensure the graphology instance has up to data "hidden" values for
		// nodes, we wait for next frame before reindexing. This won't matter in the
		// UX, because of the visible nodes bar width transition.
		requestAnimationFrame(() => {
			const index: Record<string, number> = {};
			graph.forEachNode(
				(_, { cluster, hidden }) =>
					!hidden && (index[cluster] = (index[cluster] || 0) + 1),
			);
			setVisibleNodesPerCluster(index);
		});
	}, [filters]);

	const sortedClusters = useMemo(
		() => sortBy(clusters, (cluster) => -nodesPerCluster[cluster.key]),
		[clusters, nodesPerCluster],
	);

	return (
		<Panel
			title={
				<>
					<FontAwesomeIcon icon={faObjectGroup} /> File Paths
					{visibleClustersCount < clusters.length ? (
						<Txt muted small>
							{' '}
							({visibleClustersCount} / {clusters.length})
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
						setClusters(mapValues(keyBy(clusters, 'key'), () => true))
					}
				>
					<FontAwesomeIcon icon={faSquareCheck} /> Check all
				</CustomButton>{' '}
				<CustomButton onClick={() => setClusters({})}>
					<FontAwesomeIcon icon={faRectangleXmark} /> Uncheck all
				</CustomButton>
			</ButtonsWrapper>
			<CaptionList>
				{sortedClusters.map((cluster) => {
					const nodesCount = nodesPerCluster[cluster.key];
					const visibleNodesCount = visibleNodesPerCluster[cluster.key] || 0;
					return (
						<CaptionRow
							key={cluster.key}
							title={`${nodesCount} page${nodesCount > 1 ? 's' : ''}${
								visibleNodesCount !== nodesCount
									? ` (only ${visibleNodesCount} visible)`
									: ''
							}`}
						>
							<input
								type="checkbox"
								checked={filters.clusters[cluster.key] || false}
								onChange={() => toggleCluster(cluster.key)}
								id={`cluster-${cluster.key}`}
							/>
							<label htmlFor={`cluster-${cluster.key}`}>
								<span
									data-type="circle"
									style={{
										background: cluster.color,
										borderColor: cluster.color,
									}}
								/>{' '}
								<div data-type="node-label">
									<span>{cluster.clusterLabel}</span>
									<div
										data-type="bar"
										style={{
											width:
												((100 * nodesCount) / maxNodesPerCluster || 0) + '%',
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
