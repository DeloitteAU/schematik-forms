import React from 'react';
import Option from 'rhythm-form-react/lib/controls/Option';
import InlineStatus from 'rhythm-form-react/lib/elements/InlineStatus';
import sharedPropTypes from '../sharedPropTypes';

export default class CheckboxAdapter extends React.Component {
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

		const error = getDisplayError();

		return (
			<div className="ctrl-holder">
				<Option
					id={htmlId}
					name={path}

					type="checkbox"
					checked={value}
					onChange={e => {
						handleChange(e.target.checked);
					}}
					onBlur={handleBlur}

					label={renderTextNode(data.label, 'span')}
					labelProps={{
						helpText: renderTextNode(data.labelHelpText, 'span'),
					}}
					tooltip={renderTextNode(data.tooltip)}

					disabled={computed.disabled}

					required={computed.required}
					aria-required={computed.required}
					aria-describedby={`${htmlId}-status-msg`}
					aria-invalid={!!error}
				/>

				{error &&
					<InlineStatus id={`${htmlId}-status-msg`} status="error" >{error}</InlineStatus>
				}
			</div>
		);
	}

};
