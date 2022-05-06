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
			}),
		);
		dataset.edges.forEach(([source, target]) =>
			graph.addEdge(source, target, { size: 1 }),
		);

		return () => graph.clear();
	}, [graph, dataset]);

	useEffect(() => {
		const { filePaths } = filters;
		graph.forEachNode((node, { filePath }) => {
			graph.setNodeAttribute(node, 'hidden', !filePaths[filePath]);
		});
	}, [graph, filters]);

	return <>{children}</>;
};
