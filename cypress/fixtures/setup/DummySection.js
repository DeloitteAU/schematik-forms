import React from 'react';

const DummySection = ({config, children}) => (
	<fieldset id={config.id} className="dummy-section">
		<legend>{config.data.title}</legend>
		{children}
	</fieldset>
);

export default DummySection;
