export interface NodeData {
	key: string;
	label: string;
	URL: string;
	filePath: string;
	x: number;
	y: number;
	size: number;
	imports: number;
	exports: number;
}

export interface FilePath {
	key: string;
	color: string;
	filePathLabel: string;
}

export interface Dataset {
	nodes: NodeData[];
	edges: Array<[string, string]>;
	filePaths: FilePath[];
}

export interface FiltersState {
	filePaths: Record<string, boolean>;
	onlyOrphans: boolean;
}
