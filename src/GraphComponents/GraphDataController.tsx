import { useSigma } from 'react-sigma-v2';
import { FC, useEffect } from 'react';
import { keyBy, omit } from 'lodash';
import { Dataset, FiltersState } from '../types';

// starting size of a node before any edges are established
const DEFAULT_NODE_SIZE = 5;

export interface GraphDataControllerProps {
	dataset: Dataset;
	filters: FiltersState;
}

export const GraphDataController: FC<GraphDataControllerProps> = ({
	dataset,
	filters,
	children,
}) => {
	const sigma = useSigma();
	const graph = sigma.getGraph();

	useEffect(() => {
		if (!graph || !dataset) {
			return;
		}

		const filePaths = keyBy(dataset.filePaths, 'key');

		dataset.nodes.forEach((node) =>
			graph.addNode(node.key, {
				...node,
				...omit(filePaths[node.filePath], 'key'),
			}),
		);
		dataset.edges.forEach(([source, target]) => {
			graph.addEdge(source, target, { size: 1 });
		});

		return () => graph.clear();
	}, [graph, dataset]);
	useEffect(() => {
		const { filePaths, onlyOrphans } = filters;
		graph.forEachNode((node, { filePath, size }) => {
			graph.setNodeAttribute(
				node,
				'hidden',
				/**
				 * DEFAULT_NODE_SIZE is the starting size of a node before any edges are established
				 * If an edge is established then the size is increased
				 * Thus, any nodes with size still being DEFAULT_NODE_SIZE are orphan nodes
				 */
				!filePaths[filePath] || (onlyOrphans && size > DEFAULT_NODE_SIZE),
			);
		});
	}, [graph, filters]);

	return <>{children}</>;
};
