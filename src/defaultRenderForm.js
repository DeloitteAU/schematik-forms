/* eslint-disable react/prop-types */
import React from 'react';

const defaultRenderForm = ({
	children,
	buttons,
	handleSubmit,
	errorSummary,
}) => {
	return (
		<form onSubmit={handleSubmit} noValidate >
			{errorSummary}
			{children}
			{buttons}
		</form>
	);
};

export default defaultRenderForm;
/* eslint-enable react/prop-types */
