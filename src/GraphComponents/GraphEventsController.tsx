import { useRegisterEvents, useSigma } from 'react-sigma-v2';
import { FC, useEffect } from 'react';

function getMouseLayer() {
	return document.querySelector('.sigma-mouse');
}

export interface GraphEventsControllerProps {
	setHoveredNode: (node: string | null) => void;
}

export const GraphEventsController: FC<GraphEventsControllerProps> = ({
	setHoveredNode,
	children,
}) => {
	const sigma = useSigma();
	const graph = sigma.getGraph();
	const registerEvents = useRegisterEvents();

	/**
	 * Initialize here settings that require to know the graph and/or the sigma
	 * instance:
	 */
	useEffect(() => {
		registerEvents({
			clickNode({ node }: any) {
				if (!graph.getNodeAttribute(node, 'hidden')) {
					window.open(graph.getNodeAttribute(node, 'URL'), '_blank');
				}
			},
			enterNode({ node }: any) {
				setHoveredNode(node);
				// TODO: Find a better way to get the DOM mouse layer:
				const mouseLayer = getMouseLayer();
				if (mouseLayer) {
					mouseLayer.classList.add('mouse-pointer');
				}
			},
			leaveNode() {
				setHoveredNode(null);
				// TODO: Find a better way to get the DOM mouse layer:
				const mouseLayer = getMouseLayer();
				if (mouseLayer) {
					mouseLayer.classList.remove('mouse-pointer');
				}
			},
		});
	}, [graph, registerEvents, setHoveredNode]);

	return <>{children}</>;
};
