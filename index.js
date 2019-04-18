import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Link,
} from 'react-router-dom';

const routes = [
	{ name: '/basic', component: require('./cypress/fixtures/BasicRenderingFixture').default },
	{ name: '/do-not-submit', component: require('./cypress/fixtures/DoNotSubmitFixture').default },
	{ name: '/context', component: require('./cypress/fixtures/ContextFixture').default },
	{ name: '/multiple-forms', component: require('./cypress/fixtures/MultipleFormsFixture').default },
	{ name: '/nested', component: require('./cypress/fixtures/NestedFieldRenderingFixture').default },
	{ name: '/custom', component: require('./cypress/fixtures/CustomFormRenderingFixture').default },
	{ name: '/validation/basic', component: require('./cypress/fixtures/validation/ValidationFixture').default },
	{ name: '/validation/children', component: require('./cypress/fixtures/validation/ChildValidationFixture').default },
	{ name: '/error-summary', component: require('./cypress/fixtures/ErrorSummaryFixture').default },
	{ name: '/external-errors', component: require('./cypress/fixtures/ExternalErrorsFixture').default },
	{ name: '/initial-values', component: require('./cypress/fixtures/InitialValuesFixture').default },
	{ name: '/actions/set-value', component: require('./cypress/fixtures/actions/SetValueFixture').default },
	{ name: '/actions/request-new-config', component: require('./cypress/fixtures/actions/RequestNewConfigFixture').default },
	{ name: '/actions/callback', component: require('./cypress/fixtures/actions/ActionCallbackFixture').default },
	{ name: '/rules/simple', component: require('./cypress/fixtures/rules/SimpleRuleFixture').default },
	{ name: '/rules/disabled', component: require('./cypress/fixtures/rules/DisabledRuleFixture').default },
	{ name: '/rules/required', component: require('./cypress/fixtures/rules/RequiredRuleFixture').default },
	{ name: '/rules/cascade', component: require('./cypress/fixtures/rules/CascadingRulesFixture').default },
	{ name: '/rules/complex', component: require('./cypress/fixtures/rules/ComplexRulesFixture').default },
	{ name: '/rules/nested', component: require('./cypress/fixtures/rules/NestedRulesFixture').default },
	{ name: '/rules/with-validation', component: require('./cypress/fixtures/rules/RulesAndValidationFixture').default },
	{ name: '/rules/with-initial-values', component: require('./cypress/fixtures/rules/RulesAndInitialValuesFixture').default },
	{ name: '/rules/duplicate-paths', component: require('./cypress/fixtures/rules/DuplicatePathsRulesFixture').default },
	{ name: '/rules/retain-values', component: require('./cypress/fixtures/rules/RetainValuesFixture').default },
	{ name: '/rules/custom-rule-conditions', component: require('./cypress/fixtures/rules/CustomRuleConditionsFixture').default },
];

const Index = () => {
	return (
		<ul>
			{routes.map(route => {
				return <li><Link to={route.name} >{route.name}</Link></li>;
			})}
		</ul>
	);
};

class BehavioralFixtures extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<Route exact path="/" component={Index} />
					{routes.map(route => {
						return <Route path={route.name} component={route.component} />;
					})}
				</div>
			</Router>
		);
	}
}

ReactDOM.render(<BehavioralFixtures />, document.getElementById('app'));
