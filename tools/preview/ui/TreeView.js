import React from 'react';


export default class TreeView extends React.Component {
	renderLevel(fields, depth) {
		return (fields || []).map(field => {
			return (
				<div key={field.id} style={{ paddingLeft: `${20 * depth}px` }}>
					{field.id}
					<button type="button" onClick={e => this.props.onEditFieldClick(field)}>Edit</button>
					{this.renderLevel(field.fields, depth + 1)}
				</div>
			);
		});
	}

	render() {
		const {
			config,
			registeredComponents,
		} = this.props;

		if (!config) {
			return null;
		}

		return (
			<div>
				<h2>Tree view</h2>
				{this.renderLevel(config.fields, 0)}
			</div>
		);
	}
}
