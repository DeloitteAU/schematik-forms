import React from 'react';
import Modal from 'react-modal';

export default class FormEditor extends React.Component {
	render() {
		const {
			fieldConfig,
			registeredComponents,
		} = this.props;

		if (!fieldConfig) {
			return null;
		}

		return (
			<Modal
				isOpen
				onRequestClose={this.props.onClose}
				style={{
					overlay: {
						zIndex: 100000000,
						backgroundColor: 'rgba(0, 0, 0, 0.75)',
					}

				}}
				contentLabel="Example Modal"
			>

				<div>I am a modal</div>
			</Modal>
		)
	}
}
