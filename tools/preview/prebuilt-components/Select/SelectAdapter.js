import React from 'react';
import Select from 'rhythm-form-react/lib/controls/Select';
import sharedPropTypes from '../sharedPropTypes';

const renderOptions = options => {
	return (options || []).map(({label, ...opt}) => (
		<option key={opt.value.toString()} {...opt}>{label}</option>
	));
};

export default class SelectAdapter extends React.Component {
	static propTypes = {
		...sharedPropTypes,
	};

	render() {
		const {
			htmlId,
			path,
			config,
			computed,
			handleChange,
			handleBlur,
			value,
			getDisplayError,
			renderTextNode,
		} = this.props;

		const {
			data = {},
		} = config;

		return (
			<Select
				id={htmlId}
				name={path}

				value={value}
				onChange={e => {
					handleChange(e.target.value);
				}}
				onBlur={handleBlur}

				label={renderTextNode(data.label, 'span')}
				labelProps={{
					helpText: renderTextNode(data.labelHelpText, 'span'),
				}}
				helpText={renderTextNode(data.helpText)}
				tooltip={renderTextNode(data.tooltip)}

				required={computed.required}
				disabled={computed.disabled}
				error={getDisplayError()}

				width={data.width}
			>
				{renderOptions(data.options)}
			</Select>
		);
	}
}
