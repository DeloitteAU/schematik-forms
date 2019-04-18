import React from 'react';

import FormBuilder from '~form-builder';

export default class FormPreview extends React.Component {
	componentDidCatch(error) {
		console.error(error);
	}

	render() {
		const {
			config,
			configTimestamp,
			registeredComponents,
		} = this.props;

		return (
			<FormBuilder
				onSubmit={values => {
					console.log(values);
				}}
				config={config}
				configTimestamp={configTimestamp}
				registeredComponents={registeredComponents}
				renderButtons={() => {
					return <button type="submit">Submit</button>;
				}}
			/>
		);
	}
}
