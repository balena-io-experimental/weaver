import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { useSigma } from 'react-sigma-v2';
import styled from 'styled-components';
import { Button } from '../SharedComponents';
import { FiltersState } from '../types';

const TitleWrapper = styled.div`
	z-index: 1;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	max-width: calc(100vw - var(--panels-width) - 3 * var(--stage-padding));
	padding: var(--stage-padding);
	h1 {
		font-size: 1.8em;
	}
	h1,
	h2 {
		margin: 0;
		background: var(--transparent-white);
	}
`;

const prettyPercentage = (val: number): string => {
	return (val * 100).toFixed(1) + '%';
};

export interface GraphTitleProps {
	filters: FiltersState;
	title: string | undefined;
	groupBy: string;
	onBackClick: () => void;
}

export const GraphTitle: FC<GraphTitleProps> = ({
	filters,
	title,
	groupBy,
	onBackClick,
}) => {
	const sigma = useSigma();
	const graph = sigma.getGraph();

	const [visibleItems, setVisibleItems] = useState<{
		nodes: number;
		edges: number;
	}>({ nodes: 0, edges: 0 });
	useEffect(() => {
		// To ensure the graphology instance has up to data "hidden" values for
		// nodes, we wait for next frame before reindexing. This won't matter in the
		// UX, because of the visible nodes bar width transition.
		requestAnimationFrame(() => {
			const index = { nodes: 0, edges: 0 };
			graph.forEachNode((_, { hidden }) => !hidden && index.nodes++);
			graph.forEachEdge(
				(_, _2, _3, _4, source, target) =>
					!source.hidden && !target.hidden && index.edges++,
			);
			setVisibleItems(index);
		});
	}, [filters, graph]);

	return (
		<TitleWrapper>
			<Button
				data-type="back"
				onClick={onBackClick}
				style={{ marginBottom: '15px' }}
			>
				<FontAwesomeIcon icon={faArrowLeft} /> Back
			</Button>
			<h1>{title}</h1>
			<h2>grouped by {groupBy}</h2>
			<h2>
				<i>
					{graph.order} node{graph.order > 1 ? 's' : ''}
					{visibleItems.nodes !== graph.order
						? ` (only ${prettyPercentage(
								visibleItems.nodes / graph.order,
						  )} visible),`
						: ','}{' '}
					{graph.size} edge
					{graph.size > 1 ? 's' : ''}{' '}
					{visibleItems.edges !== graph.size
						? ` (only ${prettyPercentage(
								visibleItems.edges / graph.size,
						  )} visible)`
						: ''}
				</i>
			</h2>
		</TitleWrapper>
	);
};
