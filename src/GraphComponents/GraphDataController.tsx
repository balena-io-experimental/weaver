import { useSigma } from 'react-sigma-v2';
import { FC, useEffect } from 'react';
import { keyBy, omit } from 'lodash';

import { Dataset, FiltersState } from '../types';

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
				hasEdge: false,
			}),
		);
		dataset.edges.forEach(([source, target]) => {
			graph.addEdge(source, target, { size: 1 });
			if (!graph.getNodeAttribute(target, 'hasEdge')) {
				graph.updateNode(target, (attributes) => ({
					...attributes,
					hasEdge: true,
				}));
			}
			if (!graph.getNodeAttribute(source, 'hasEdge')) {
				graph.updateNode(source, (attributes) => ({
					...attributes,
					hasEdge: true,
				}));
			}
		});

		return () => graph.clear();
	}, [graph, dataset]);
	useEffect(() => {
		const { filePaths, onlyOrphans } = filters;
		graph.forEachNode((node, { filePath, hasEdge }) => {
			graph.setNodeAttribute(
				node,
				'hidden',
				!filePaths[filePath] || (onlyOrphans && hasEdge),
			);
		});
	}, [graph, filters]);

	return <>{children}</>;
};
