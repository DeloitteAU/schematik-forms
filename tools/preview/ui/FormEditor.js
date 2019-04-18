import React from 'react';
import TreeView from './TreeView';
import EditField from './EditField';

export default class FormEditor extends React.Component {
	state = {
		activeField: null,
	}

	_handleEditFieldClick = field => {
		this.setState({
			activeField: field,
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
				<TreeView
					config={config}
					onEditFieldClick={this._handleEditFieldClick}
				/>

				{this.state.activeField &&
					<EditField
						onClose={() => {
							this.setState({
								activeField: null,
							});
						}}
						fieldConfig={this.state.activeField}
					/>
				}
			</div>
		);
	}
}
