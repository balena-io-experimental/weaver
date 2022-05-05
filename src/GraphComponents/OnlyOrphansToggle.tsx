import { FC } from 'react';
import { FiltersState } from '../types';
import styled from 'styled-components';

const OnlyOrphansToggleContainer = styled.div`
	position: relative;
	width: calc(100%);
	height: 3em;
	box-shadow: var(--shadow);
	background-color: white;
	border: none;
	outline: none;
	border-radius: var(--border-radius);
	margin-bottom: 0.5em;
	padding: 1em 1em 1em 1em;
	input[type='checkbox'] {
		float: right;
		transform: scale(2);
		&:focus {
			outline: 0;
		}
	}
`;

export interface OnlyOrphansToggleProps {
	filters: FiltersState;
	toggleOnlyOrphans: (value: boolean) => void;
}

export const OnlyOrhpanToggle: FC<OnlyOrphansToggleProps> = ({
	filters,
	toggleOnlyOrphans,
}) => {
	return (
		<OnlyOrphansToggleContainer>
			<label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
				Hide nodes with links
			</label>
			<input
				type="checkbox"
				placeholder="Search in nodes..."
				list="nodes"
				checked={filters.onlyOrphans}
				onChange={(e) => {
					toggleOnlyOrphans(e.target.checked);
				}}
			/>
		</OnlyOrphansToggleContainer>
	);
};
