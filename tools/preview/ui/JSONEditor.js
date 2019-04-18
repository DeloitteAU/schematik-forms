import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/monokai';

export default class JSONEditor extends React.Component {
	render() {
		return (
			<AceEditor
				style={{
					width: '100%',
					height: '100%',
				}}
				mode="json"
				theme="monokai"
				name="json-form-editor"
				onChange={this.props.onChange}
				value={this.props.rawJSON}
			/>
		);
	}
}
