import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

export default class OptimiseField extends React.Component {
	static propTypes = {
		shouldOptimise: PropTypes.bool.isRequired,
		children: PropTypes.node.isRequired,
	}

	shouldComponentUpdate(nextProps) {
		if (!nextProps.shouldOptimise) {
			return true;
		}

		return !isEqual(this.props, nextProps);
	}

	render() {
		return this.props.children;
	}
}
