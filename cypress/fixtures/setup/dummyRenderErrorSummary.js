import React from 'react';

const renderErrorSummary = ({summaryData}) => {
	if (!summaryData || !summaryData.length) {
		return null;
	}

	return (
		<ul id="error-summary">
			{summaryData.map(item => (
				<li className="summary-item">
					<span className="id">{item.fieldId}</span>
					<span className="label">{item.label}</span>
					<span className="message">{item.errors}</span>
				</li>
			))}
		</ul>
	);
};

export default renderErrorSummary;
