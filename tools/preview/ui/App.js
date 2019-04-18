import React from 'react';
import Modal from 'react-modal';
import JSONEditor from './JSONEditor';
import Layout from './Layout';
import FormPreview from './FormPreview';
import TextAdapter from '../prebuilt-components/Text/TextAdapter';
import TextareaAdapter from '../prebuilt-components/Textarea/TextareaAdapter';
import SelectAdapter from '../prebuilt-components/Select/SelectAdapter';
import RadioGroupAdapter from '../prebuilt-components/RadioGroup/RadioGroupAdapter';
import CheckboxGroupAdapter from '../prebuilt-components/CheckboxGroup/CheckboxGroupAdapter';
import CheckboxAdapter from '../prebuilt-components/Checkbox/CheckboxAdapter';
import FormEditor from './FormEditor';
import exampleConfig from '../exampleConfig.json';

Modal.setAppElement('#root');

const components = {
	'text': {
		defaultValue: '',
		component: TextAdapter,
	},
	'textarea': {
		defaultValue: '',
		component: TextareaAdapter,
	},
	'select': {
		defaultValue: '',
		component: SelectAdapter,
	},
	'radio-group': {
		defaultValue: '',
		component: RadioGroupAdapter,
	},
	'checkbox-group': {
		defaultValue: '',
		component: CheckboxGroupAdapter,
	},
	'checkbox': {
		defaultValue: '',
		component: CheckboxAdapter,
	},
};

export default class App extends React.Component {
	state = {
		rawJSON: JSON.stringify(exampleConfig, null, '\t'),
		invalidJSON: false,
		config: exampleConfig,
		configTimestamp: Date.now(),
	}

	_handleEditorChange = editorValue => {
		try {
			this.setState({
				config: JSON.parse(editorValue),
				configTimestamp: Date.now(),
				invalidJSON: false,
			});
		} catch (e) {
			this.setState({
				invalidJSON: true,
			});
			console.error(e);
		}

		this.setState({
			rawJSON: editorValue,
		});
	}

	render() {
		return (
			<Layout
				leftPanel={
					<JSONEditor
						onChange={this._handleEditorChange}
						rawJSON={this.state.rawJSON}
					/>
				}
				rightPanel={
					<React.Fragment>
						{this.state.invalidJSON &&
							<div
								style={{ background: '#d62ca6', color: 'white', position: 'sticky', top: '0', margin: '0 60px', lineHeight: '40px', textAlign: 'center', zIndex: '1000000' }}
							>
								Showing old form, check JSON
							</div>
						}

						<div
							style={{
								padding: 20,
							}}
						>
							<FormPreview
								config={this.state.config}
								configTimestamp={this.state.configTimestamp}
								registeredComponents={components}
							/>

							{/* TODO for another day */}
							{/* <FormEditor
								config={this.state.config}
								registeredComponents={components}
							/> */}
						</div>
					</React.Fragment>
				}
			/>
		);
	}
}

