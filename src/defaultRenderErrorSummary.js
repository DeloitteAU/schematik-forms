import React from 'react';
import PropTypes from 'prop-types';

const focusField = fieldId => {
	const element = document.getElementById(fieldId);

	if (element && element.focus) {
		element.focus();

		const rect = element.getBoundingClientRect();
		window.scrollTo(0, rect.y);
	}
};

const renderItem = (id, label, message) => {
	return (
		<li key={id}>
			<a
				onClick={e => {
					e.preventDefault();

					focusField(id);
				}}
				href={`#${id}`}
			>
				{label}: {message}
			</a>
		</li>
	);
};

const renderField = field => {
	if (!field.errors || !field.errors.length) {
		return null;
	}

	const error = field.errors[0];

	if (error && typeof error === 'string') {
		return [renderItem(field.fieldId, field.label, error)];
	}

	const items = [];

	if (error && error.message) {
		items.push(renderItem(field.fieldId, field.label, error.message));
	}

	if (error && error.children && error.children.length) {
		error.children.forEach(child => {
			items.push(renderItem(field.fieldId, child.summaryLabel, child.message));
		});
	}

	return items;
};

class ErrorSummary extends React.Component {
	static propTypes = {
		submitCount: PropTypes.number.isRequired,
		summaryData: PropTypes.array.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			submitCount: this.props.submitCount,
			summaryData: this.props.summaryData,
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.submitCount !== state.submitCount) {
			return {
				submitCount: props.submitCount,
				summaryData: props.summaryData,
			};
		}

		return null;
	}

	render() {
		return (
			<ul>
				{this.state.summaryData.reduce((items, field) => {
					return [
						...items,
						...renderField(field),
					];
				}, [])}
			</ul>
		);
	};
}

/* eslint-disable react/prop-types */
const defaultRenderErrorSummary = ({summaryData, submitCount}) => {
	return (
		<ErrorSummary submitCount={submitCount} summaryData={summaryData} />
	);
};
/* eslint-enable react/prop-types */

export default defaultRenderErrorSummary;
