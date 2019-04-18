import React from 'react';

const DummyRadio = ({path, config, handleChange, errors, value}) => (
	<div className="dummy-radio">
		<label>{config.data.label}</label>
		<label>
			<span>Yes</span>
			<input type="radio" onChange={() => handleChange('yes')} name={path} value="yes" checked={value === 'yes'} />
		</label>
		<label>
			<span>No</span>
			<input type="radio" onChange={() => handleChange('no')} name={path} value="no" checked={value === 'no'} />
		</label>
		{(errors || []).map(error => {
			return <div className="error" style={{color: 'red'}}>{error}</div>;
		})}
	</div>
);

export default DummyRadio;
