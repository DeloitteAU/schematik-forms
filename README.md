![Deloitte Digital](https://raw.githubusercontent.com/DeloitteDigitalAPAC/react-habitat/master/dd-logo.png)

# Schematick Forms

Schematick Forms is an elegant form builder for React. It uses schema based configuration (see [JSON Forms Specification](https://github.com/DeloitteDigitalAPAC/json-forms-specification)) to render forms consistently with little effort.

This library is a relatively thin wrapper around the [Formik](https://github.com/jaredpalmer/formik) library. Schematic forms will orchestrate the automatation of building forms via the
schema based JSON.

## Features

- Supports error summaries
- Fully customisable, define your own renders
- Supports rules like "show field when" or "hide field when"
- You have full control over how the form will render
- You register the components that will render each field. (BYO form components, compatible with all react ui/form component libraries)
- You register the validation rules that your form will use

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [How do I ...](#how-do-i-)
    - [Customise the rendering of my form?](#customise-the-rendering-of-my-form)
    - [Add a submit or cancel button to my form?](#add-a-submit-or-cancel-button-to-my-form)
    - [Register a field component?](#register-a-field-component)
    - [Register a validation rule?](#register-a-validation-rule)
    - [Register a custom form action?](#register-a-custom-form-action)
    - [Do something once the form has been submitted?](#do-something-once-the-form-has-been-submitted)
- [API](#api)
  - [FormBuilder](#formbuilder)
    - [config](#config)
    - [configTimestamp](#configtimestamp)
    - [registeredComponents?](#registeredcomponents)
      - [Component object](#component-object)
    - [registeredValidators?](#registeredvalidators)
    - [registeredActions?](#registeredactions)
    - [onSubmit?: (values) => void](#onsubmit-values--void)
    - [renderForm?: (props: object) => node](#renderform-props-object--node)
    - [renderButtons?: () => node](#renderbuttons---node)
    - [renderErrorSummary?: ({summaryData: Array, submitCount: Number}) => node](#rendererrorsummary-summarydata-array-submitcount-number--node)
  - [Props passed to registered components](#props-passed-to-registered-components)
    - [path: string](#path-string)
    - [htmlId: string](#htmlid-string)
    - [config: object](#config-object)
    - [computed: object](#computed-object)
    - [value: any](#value-any)
    - [errors: string[]](#errors-string)
    - [externalErrors: string[]](#externalerrors-string)
    - [touched: boolean](#touched-boolean)
    - [children: node](#children-node)
    - [getFieldError: () => string](#getfielderror---string)
    - [getChildError: (childName: string) => string](#getchilderror-childname-string--string)
    - [renderTextNode: (textNode: string|object, tag: string|element) => string](#rendertextnode-textnode-stringobject-tag-stringelement--string)
    - [runActions: (value: any) => string](#runactions-value-any--string)
    - [Event handlers for fields that should validate on change](#event-handlers-for-fields-that-should-validate-on-change)
      - [handleChange: (value: any) => void](#handlechange-value-any--void)
      - [handleBlur: (event) => void](#handleblur-event--void)
    - [Event handlers for fields that should validate on blur](#event-handlers-for-fields-that-should-validate-on-blur)
      - [handleChangeFast: (value: any, ?triggersTouched: boolean) => void](#handlechangefast-value-any-triggerstouched-boolean--void)
      - [handleBlurFast: (event) => void](#handleblurfast-event--void)
      - [handleKeyPressFast: (event) => void](#handlekeypressfast-event--void)
  - [Props passed to registered validators](#props-passed-to-registered-validators)
    - [fieldValue: any](#fieldvalue-any)
    - [formValues: object](#formvalues-object)
    - [message: string](#message-string)
    - [options: any](#options-any)
  - [Errors returned from validation functions](#errors-returned-from-validation-functions)
  - [Props passed to registered actions](#props-passed-to-registered-actions)
    - [action: object](#action-object)
    - [fieldValue: any](#fieldvalue-any-1)
    - [formValues: object](#formvalues-object-1)
    - [setFieldValue: (fieldPath, value) => void](#setfieldvalue-fieldpath-value--void)
    - [triggerCallback: (actionType: string, actionData: any, formValues: any) => void](#triggercallback-actiontype-string-actiondata-any-formvalues-any--void)
  - [Want to contribute?](#want-to-contribute)
  - [Key Contributors](#key-contributors)
  - [Who is Deloitte Digital?](#who-is-deloitte-digital)
  - [LICENSE (BSD-3-Clause)](#license-bsd-3-clause)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

`yarn add schematik-forms` or `npm install schematik-forms --save`

You will also need to install the following **peer dependecies** if you havnt already:

- `yarn add formik@1` or `npm install --save formik@1`
- `yarn add react@16` or `npm install --save react@16`

## Getting started

The code below will render a simple login form:

```js
import FormBuilder from 'json-form-builder-react/lib';

// BYO components
import {MyTextComponent, MyPasswordComponent} from '../my-components'; 

// This config would ideally come from your backend system.
const myConfig = {
	"version": 0,
	"id": "loginForm",
	"fields": [
		{
			"id": "email",
			"path": "email",
			"type": "text",
			"data": {
				"label": "Your email address"
			}
		},
		{
			"id": "password",
			"path": "secret.password",
			"type": "password",
			"data": {
				"label": "Your password"
			}
		}
	]
}

<FormBuilder 
	config={myConfig}
	renderButtons={() => (<button type="submit">Log in</button>)}}
	registeredComponents={{
		text: {
			component: MyTextComponent,
			defaultValue: '',
		},
		password: {
			component: MyPasswordComponent,
			defaultValue: '',
		},
	}}
	onSubmit={values => {
		/**
		 * Do something on submit, `values` is an object that uses each fields 'path' as keys:
		 * For example: 
		 * {
		 *   email: 'john@email.com',
		 *   secret: {
		 *     password: 'password123'
		 *   }
		 * }
		 */ 
	}}
/>
```

## How do I ...

### Customise the rendering of my form?

By default the form will be rendered as a simple `<form>` element, but you can use the `renderForm` render prop to customise this completely.

[View API docs for `renderForm`](#renderform-props-object--node)

> IMPORTANT 
> When providing your own `renderForm` function you will need to render the `children` and `button` parameters somewhere. If you don't render them, they won't show up.
>
> It's also important to hook up your form's `onSubmit` callback to the `handleSubmit` parameter.

```js
<FormBuilder 
	renderForm={({handleSubmit, children, buttons}) => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-on-the-left">
					{children}
				</div>

				<div className="buttons-on-the-right">
					{buttons}
				</div>
			</form>
		)
	}}
/>
```

### Add a submit or cancel button to my form?

No buttons will be rendered by default. It's up to you to provide the buttons for your form using the `renderButtons` prop.

[View API docs for `renderButtons`](#renderbuttons---node)

```js
<FormBuilder 
	renderButtons={({handleSubmit, children, buttons}) => {
		return (
			<React.Fragment>
				<a href="/homepage">
					Cancel
				</a>

				<button type="submit">
					Submit my answers
				</button>
			</React.Fragment>
		)
	}}
/>
```

### Register a field component?

The `registeredComponents` prop is used to pass an object mapping the component type to a React component. 

> Note: `registeredComponents` expects React components, not render props.

Each component will be passed a set of predefined props, [view API docs for `registeredComponents`](#registeredcomponents) for details.

Because `registeredComponents` is just an object mapping keys to React components, you can define those components in anyway you like.

You **must** also provide a `defaultValue` for each component type.

```js
const components = {
	// As a stateless functional component
	text: {
		defaultValue: '',
		component: function TextInput(props) {
			// Use props to build your component
		}
	},
	// Or as a class
	datepicker: {
		defaultValue: null,
		component: class MyDatePicker extends React.Component {
			// Use props to build your component
		}
	}
}

<FormBuilder 
	registeredComponents={components}
/>
```

### Register a validation rule?

The `registeredValidators` prop is used to pass an object mapping the validator type/name to a validation function. 

Each validators will be passed an object with a set of predefined properties, [view API docs for `registeredvalidators`](#registeredvalidators) for details.

Validation functions should return an error message if invalid, undefined otherwise.

```js
const validators = {
	myValidationRule: function ({fieldValue, formValues, message="Default message", options}) {
		// return undefined or an error message here
		if (!isValid(fieldValue)) {
			return message;
		}

		return undefined;
	},
}

<FormBuilder 
	registeredValidators={validators}
/>
```

### Register a custom form action?

The `registeredActions` prop is used to pass an object mapping the action type/name to an action function. 

You can use this action function to achieve whatever ever side effect you need to perform in response to a field changing.

Each action function will be passed an object with a set of predefined properties, [view API docs for `registeredActions`](#registeredActions) for details.

Action functions aren't expected to return anything, they are purely for performing side effects.

```js
const actions = {
	myCustomAction: function ({fieldValue, formValues, action, setFieldValue}) {
	// Access the original action config via `action`
	console.log(action.data);

	// Call an api
	axios.post('my/endpoint', formValues);

	// Set a value in the form
	setFieldValue('name.first', 'John');
	},
}

<FormBuilder 
	registeredActions={actions}
/>
```

### Do something once the form has been submitted?

The `onSubmit` prop is used to called on successful submission of the form.

```js
<FormBuilder 
	onSubmit={values => {
		// do something with values
	})}
/>
```

# API

## FormBuilder

### config

A [JSON form configuration object](#json-forms-spec) that describes the form.

### configTimestamp

A timestamp of the last time a new config was provided.

**This is important** for letting the form builder know when the config has changed, failure to update the timestamp will result in unexpected results.

This is an alternative to performing a deep equality check on `config`, which would affect performance.

### registeredComponents?

An object that maps 'component types' to Component objects.

e.g. 
```js
{
	'type-1': {
		defaultValue: '',
		component: MyComponent
	},
	'type-2': {
		defaultValue: {},
		component: MyOtherComponent
	}
}
```

#### Component object

| prop         | type            | description                                 |
|:-------------|:----------------|:--------------------------------------------|
| defaultValue | any             | The default value for fields of this type, this is required. |
| component    | React component | The component to render for this field type. This component will be passed a number of props to interface with the form builder, [see here for a full list](#Props-passed-to-registered-components) |

### registeredValidators?

An object that maps 'validator types' to validation functions.

Each validation function will be passed a number of props to interface with the form builder, [see here for a full list](#Props-passed-to-registered-validators)

e.g. 
```js
{
	'validator-1': () => {},
	'validator-2': () => {},
}
```

### registeredActions?

An object that maps 'action types' to action functions.

Each action function will be passed a number of props to interface with the form builder, [see here for a full list](#Props-passed-to-registered-actions)

e.g. 
```js
{
	'action-1': () => {},
	'action-2': () => {},
}
```

### onSubmit?: (values) => void

Called on successful/valid submission of the form.

`values` will not include values from fields that were not shown to the user or were disabled.

### renderForm?: (props: object) => node

Use the `renderForm` render prop to completely customise the rendering of your form. You will need to ensure you render some of the props below in order for the form to behave correctly. 

By default, the form will be rendered as a simple `<form />` tag.

`renderForm` is passed an object with the following properties:

| prop         | type          | description                                   |
|:-------------|:--------------|:----------------------------------------------|
| handleSubmit | (event) => {} | You must call this callback when your custom form is submitted |
| children     | node          | The form fields rendered by the form builder, you must render this prop to see your form fields |
| buttons      | node          | The output of `renderButtons()`, you must render this prop to see your buttons |
| errorSummary | node          | The output of `renderErrorSummary()`, you must render this prop to see your error summary |

### renderButtons?: () => node

Use the `renderForm` render prop to customise the rendering of your form buttons.

By default, no buttons are rendered.

Nothing is currently passed to the `renderButtons` render prop.

### renderErrorSummary?: ({summaryData: Array, submitCount: Number}) => node

Use the `renderErrorSummary` render prop to customise the rendering of your form's error summary.

`renderErrorSummary` is passed an array of objects as `summaryData` in the format:

| prop    | type     | description                                             |
|:--------|:---------|:--------------------------------------------------------|
| fieldId | string   | The full id of the field in the tree. Useful for referencing the original field that the error belongs to. |
| label   | node     | The label to display in the error summary for this field |
| errors  | string[] | An array of error messages relating to this field       |

`renderErrorSummary` is passed the number of times the user has submitted the form as `submitCount`.

## Props passed to registered components

### path: string

The path for this field

### htmlId: string

The full id in the form tree, including the form id. 

This is useful when you need an id that's unique among all fields and forms, such as associated a label with an input or aria attributes.

e.g. `form1.first.second.third`
```
{
	id: 'form1',
	fields: [
		{
			id: 'first'
			fields: [
				{
					id: 'second'
					fields: [
						{
							id: 'third'
						}
					]
				}
			]
		}
	]
}
```

### config: object

The config object for *this field only*

### computed: object

An object containing the computed properties (computed from rules in the config) for this field.

The computed properties available in this object are:

| prop     | type    | description        |
|:---------|:--------|:-------------------|
| disabled | boolean | Defaults to false. |
| required | boolean | Defaults to false. |

### value: any

The current value of the field

### errors: string[]

The validation errors associated with this field

### externalErrors: string[]

The external/server validation errors associated with this field

### touched: boolean

Whether or not this field has been touched/visited. Useful for display errors correctly.

### children: node

You must render this prop in your component if other other fields can be nested inside this one (a section/fieldset for example)

```js
({children}) => {
	return <fieldset>{children}</fieldset>
}
```

Failure to render this prop will result in the nested fields not being displayed.

### getFieldError: () => string

A helper function that will return the first error when the field is touched. Alternatively you can roll your own behaviour by using a combination of the `errors`, `externalErrors` and `touched` props.

### getChildError: (childName: string) => string

A helper function that extracts an error for a specific child in the field. The `childName` is defined per field component.

This is useful when you need to map an error message to an input that isn't a 'field'. Consider an 'address field' for example, which might consist of many different inputs internally (postcode, state etc.). In this case you might have a single validator that outputs an error message for each input in the address field. Your childName might be `postcode` or `state`.

Alternatively you can roll your own behaviour by using a combination of the `errors`, `externalErrors` and `touched` props.

### renderTextNode: (textNode: string|object, tag: string|element) => string

A helper function that parses a `TextNode` object (see the [JSON forms spec](#JSON-forms-spec) for more details) and renders the correct output.

If the textnode is just a string, then a string will be rendered.

If the textnode is type 'text', then a string will be rendered.

If the textnode is type 'richtext', then the content will be rendered in a div using `dangerouslySetInnerHTML`. For this reason it's essential that any richtext content is safe to render onto the page.

By default rich text is rendered inside a div, but this can be customised via the second argument.

For example this will render a `span` instead of a `div`:

```js
renderTextNode(textNode, 'span')
```

### runActions: (value: any) => string

Use this to manually run the field's actions, for example on click of a button.

### Event handlers for fields that should validate on change

For fields that should validate whenever they change, use the normal handlers. This would include checkboxes, radio buttons and select inputs for example.

It's important to implement both `handleChange` and `handleBlur` in your component.

See the [fast handlers](#Event-handlers-for-fields-that-should-validate-on-blur) to improve performance for text-like fields.

#### handleChange: (value: any) => void

Call this anytime the value of your component changes

#### handleBlur: (event) => void

Call this when your component is blurred/unfocused

### Event handlers for fields that should validate on blur

To improve the performance of fields that a user types into, such as a text input or a textarea, you can use a set of handlers with the `Fast` suffix.

When using these handlers, the value will be stored in local state until the field is blurred, which saves the form from validating and running calculations on every keystroke.

It's important to implement all three handlers (`handleChangeFast`, `handleBlurFast` and `handleKeyPressFast`) in your component.

#### handleChangeFast: (value: any, ?triggersTouched: boolean) => void

Call this anytime the value of your component changes

An optional second parameter called `triggersTouched` can be passed into `handleChange`, which will determine when a change will also cause the field to become touched. Defaults to `true`.

#### handleBlurFast: (event) => void

Call this when your component is blurred/unfocused

#### handleKeyPressFast: (event) => void

Call this when a key is pressed in your component. This is (unfortunately) used to ensure that the value of the field is submitted when the user submits via the enter key.

## Props passed to registered validators

Each validation function is passed an option with the following properties:

### fieldValue: any

The value of the field being validated

### formValues: object

The values of the whole form, use this if your validator needs to read the values of other fields.

### message: string

The message to display when the field is invalid. Ideally you would set a default message for each validator.

### options: any

Any arbritrary option data that was passed to the validator.

## Errors returned from validation functions

It's usually enough to just return a `string` (the error message) or `undefined` if the field is valid.

However there are times when you need a more descriptive error message, in these cases you can return errors as an object.

```js
{ 
	message: 'The field\'s error', // optional
	children: [
		{ 
			name: 'postcode', // component would use this to internally map the error message to the correct input
			message: 'Postcode should only be numbers',
			summaryLabel: 'Postcode'
		}
	]
}
```

## Props passed to registered actions

Each validation function is passed an option with the following properties:

### action: object

The original action configuration from the JSON form config.

### fieldValue: any

The value of the field that has changed (the field that caused the action).

### formValues: object

The values of the whole form, use this if your action needs to read the values of other fields.

### setFieldValue: (fieldPath, value) => void

A function you can call to update a field's value in the form.

### triggerCallback: (actionType: string, actionData: any, formValues: any) => void

A function you can call to trigger an `onActionCallback` on the FormBuilder component.


## Want to contribute?

* Got an amazing idea to make this better?
* Found an annoying bug?

Please don't hesitate to raise an issue through GitHub or open a pull request to show off your fancy pants coding skills - we'll really appreciate it!

## Key Contributors

* @jeffdowdle
* @saxoncameron

## Who is Deloitte Digital?

**Part Business. Part Creative. Part Technology. One hundred per cent digital.**

Pioneered in Australia, Deloitte Digital is committed to helping clients unlock the business value of emerging technologies. We provide clients with a full suite of digital services, covering digital strategy, user experience, content, creative, engineering and implementation across mobile, web and social media channels.

[http://www.deloittedigital.com/au](http://www.deloittedigital.com/au)

## LICENSE (BSD-3-Clause)
Copyright (C) 2018, Deloitte Digital. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

**[⬆ back to top](#table-of-contents)**