import { useState } from 'react';
import styled from 'styled-components';
import { Graph } from './Graph';
import { Button, Select } from './SharedComponents';

const UserInteractionWrapper = styled.div`
	flex-direction: column;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
`;

const Card = styled.div`
	flex-direction: column;
	display: flex;
	border: 1px solid #b6b6b6;
	width: 600px;
	padding: 40px 20px;
	box-shadow: 2px 6px 10px rgb(136 136 136 / 30%);
	margin: 10px 0px;
`;

const Input = styled.input`
	padding: 0.5em;
	margin: 0.5em 0.5em 2em 0.5em;
	height: 40px;
	border: 1px solid #dcdcdc;
	border-radius: 5px;
`;

export const App = () => {
	const [owner, setOwner] = useState<string>();
	const [repoName, setRepoName] = useState<string>();
	const [token, setToken] = useState<string>();
	const [groupBy, setGroupBy] = useState<string>('export');
	const [showGraph, setShowGraph] = useState<boolean>();

	if (!showGraph) {
		return (
			<UserInteractionWrapper>
				<h1>weaver</h1>
				<Card>
					<h3>Insert GitHub information:</h3>
					<label>Owner:</label>
					<Input onChange={(e) => setOwner(e.target.value)} />
					<label>Repository name:</label>
					<Input onChange={(e) => setRepoName(e.target.value)} />
					<label>Token:</label>
					<Input type="password" onChange={(e) => setToken(e.target.value)} />
					<label>Group by:</label>
					<Select onChange={(e) => setGroupBy(e.target.value)}>
						<option value="export">Export</option>
						<option value="module">Module</option>
					</Select>
					<div>
						<Button
							disabled={!owner || !repoName}
							onClick={() => setShowGraph(true)}
						>
							GO!
						</Button>
					</div>
				</Card>
				<img src="logo.svg" style={{ height: '200px', width: '200px' }} />
			</UserInteractionWrapper>
		);
	}

	return (
		<div id="app-root">
			<Graph
				owner={owner!}
				repoName={repoName!}
				token={token}
				groupBy={groupBy}
				setShowGraph={setShowGraph}
				setOwner={setOwner}
				setRepoName={setRepoName}
				setToken={setToken}
			/>
		</div>
	);
};
