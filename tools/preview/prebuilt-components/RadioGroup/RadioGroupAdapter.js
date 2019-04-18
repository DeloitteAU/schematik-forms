import React from 'react';
import OptionGroup from 'rhythm-form-react/lib/controls/OptionGroup';
import sharedPropTypes from '../sharedPropTypes';

export default class RadioGroupAdapter extends React.Component {
	static propTypes = {
		...sharedPropTypes,
	}

	render() {
		const {
			htmlId,
			path,
			config,
			computed,
			handleChange,
			value,
			getDisplayError,
			renderTextNode,
		} = this.props;

		const {
			data = {},
		} = config;

		return (
			<OptionGroup
				id={htmlId}
				name={path}

				type="radio"
				value={value}
				onChange={handleChange}
				options={data.options}

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
			/>
		);
	}
};
