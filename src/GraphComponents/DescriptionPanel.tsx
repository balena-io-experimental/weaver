import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Panel } from './Panel';
import ReactMarkdown from 'react-markdown'
import { getRepoReadme } from '../utils/requests';

export const DescriptionPanel: FC = () => {

	const [readmeFile, setReadmeFile] = useState<string>();

	useEffect(() => {
		getRepoReadme().then(({ data }) => {
			setReadmeFile(data.data);
		}).catch(console.error)
	}, [])

	if (!readmeFile) {
		return null;
	}

	return (
		<Panel
			title={
				<>
					<FontAwesomeIcon icon={faCircleInfo} /> Description
				</>
			}
		>
			 <ReactMarkdown children={readmeFile} />
		</Panel>
	);
};
