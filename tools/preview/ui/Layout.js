import React from 'react';

import './Layout.scss';

export default class Layout extends React.Component {
	render() {
		const {
			leftPanel,
			rightPanel
		} = this.props;

		return (
			<div className="Layout" >
				<div className="Layout__left-panel">
					{leftPanel}
				</div>

				<div className="Layout__right-panel">
					{rightPanel}
				</div>
			</div>
		);
	}
}
