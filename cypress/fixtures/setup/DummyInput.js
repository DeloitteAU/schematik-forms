import React from 'react';

const DummyInput = ({
	path,
	config,
	htmlId,
	handleChangeFast,
	handleBlurFast,
	handleKeyPressFast,
	errors,
	externalErrors,
	value,
	touched,
	computed,
}) => {
	return (
		<div className="dummy-input">
			<label htmlFor={htmlId}>{config.data.label}</label>
			<input type="text" id={htmlId} onChange={e => handleChangeFast(e.target.value)} onBlur={handleBlurFast} onKeyPress={handleKeyPressFast} name={path} value={value} disabled={computed.disabled} required={computed.required} />
			{(externalErrors || []).map((error, i) => {
				return <div key={i} className="error" style={{ color: 'red' }}>{error}</div>;
			})}
			{(touched && errors || []).map((error, i) => {
				return <div key={i} className="error" style={{ color: 'red' }}>{error}</div>;
			})}
		</div>
	);
};

export default DummyInput;
