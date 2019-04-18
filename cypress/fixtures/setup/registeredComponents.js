import DummyInput from './DummyInput';
import DummySection from './DummySection';
import DummyRadio from './DummyRadio';
import DummyGroupedInput from './DummyGroupedInput';

export default {
	'dummy-input': {
		component: DummyInput,
		defaultValue: '',
	},
	'dummy-section': {
		component: DummySection,
	},
	'dummy-radio': {
		component: DummyRadio,
		defaultValue: '',
	},
	'dummy-grouped-input': {
		component: DummyGroupedInput,
		defaultValue: {
			given: '',
			family: '',
		},
	},
};
