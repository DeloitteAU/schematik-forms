import React from 'react';
import TextArea from 'rhythm-form-react/lib/controls/TextArea';
import sharedPropTypes from '../sharedPropTypes';

export default class TextAreaAdapter extends React.Component {
	static propTypes = {
		...sharedPropTypes,
	}

	render() {
		const {
			config,
			computed,
			htmlId,
			path,
			handleChangeFast,
			handleBlurFast,
			handleKeyPressFast,
			value,
			getDisplayError,
			renderTextNode,
		} = this.props;

		const {
			data = {},
		} = config;

		const {
			inputAttrs = {},
		} = data;

		return (
			<TextArea
				id={htmlId}
				name={path}

				value={value}
				onChange={e => {
					handleChangeFast(e.target.value);
				}}
				onBlur={handleBlurFast}
				onKeyPress={handleKeyPressFast}

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

				{...inputAttrs}
			/>
		);
	}
}
