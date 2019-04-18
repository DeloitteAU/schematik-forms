import React from 'react';

export default class DummyGroupedInput extends React.Component {
	render() {
		const {
			path,
			config,
			htmlId,
			handleChangeFast,
			handleBlurFast,
			handleKeyPressFast,
			value,
			getDisplayError,
			getChildError,
		} = this.props;

		return (
			<div id={htmlId} className="dummy-grouped-input" style={{ background: '#EEF', border: '1px solid #CCD' }}>
				<strong>{config.data && config.data.label}</strong>

				<span id={`${htmlId}-error`} style={{color: 'red'}}>{getDisplayError()}</span>

				<div>
					<label style={{ display: 'block' }}>
						<span>Given</span>
						<input
							type="text"
							id={`${htmlId}-given`}
							onChange={e => handleChangeFast({
								...value,
								given: e.target.value,
							})}
							onBlur={handleBlurFast}
							onKeyPress={handleKeyPressFast}
							value={value.given}
						/>
					</label>

					<div id={`${htmlId}-given-error`} style={{color: 'red'}}>{getChildError('given')}</div>
				</div>

				<div>
					<label style={{ display: 'block' }}>
						<span>Family</span>
						<input
							type="text"
							id={`${htmlId}-family`}
							onChange={e => handleChangeFast({
								...value,
								family: e.target.value,
							})}
							onBlur={handleBlurFast}
							onKeyPress={handleKeyPressFast}
							value={value.family}
						/>
					</label>

					<div id={`${htmlId}-family-error`} style={{color: 'red'}}>{getChildError('family')}</div>
				</div>
			</div>
		);
	};
}
