import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Panel } from './Panel';

export interface DescriptionPanelProps {
	readmeFile: string;
}

export const DescriptionPanel: FC<DescriptionPanelProps> = ({ readmeFile }) => {
	return (
		<Panel
			initiallyDeployed
			title={
				<>
					<FontAwesomeIcon icon={faCircleInfo} /> Description
				</>
			}
		>
			test
		</Panel>
	);
};
