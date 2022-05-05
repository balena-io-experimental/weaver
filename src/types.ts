export interface NodeData {
	key: string;
	label: string;
	URL: string;
	cluster: string;
	x: number;
	y: number;
	size: number;
}

export interface Cluster {
	key: string;
	color: string;
	clusterLabel: string;
}

export interface Dataset {
	nodes: NodeData[];
	edges: Array<[string, string]>;
	clusters: Cluster[];
}

export interface FiltersState {
	clusters: Record<string, boolean>;
}
