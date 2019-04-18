import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/monokai';

export default class FormPreview extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={components}
			/>
		);
	}
}
