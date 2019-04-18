import PropTypes from 'prop-types';

export const sharedPropTypes = {
	htmlId: PropTypes.string.isRequired,
	path: PropTypes.string,
	config: PropTypes.object.isRequired,
	computed: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	handleChangeFast: PropTypes.func.isRequired,
	handleBlurFast: PropTypes.func.isRequired,
	handleKeyPressFast: PropTypes.func.isRequired,
	value: PropTypes.any,
	errors: PropTypes.array,
	externalErrors: PropTypes.array,
	touched: PropTypes.bool.isRequired,
};

export const sharedDefaultProps = {
	path: undefined,
};

export default sharedPropTypes;
