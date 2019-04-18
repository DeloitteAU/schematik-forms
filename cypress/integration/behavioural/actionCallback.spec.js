context('Sanity check - Actions - Set value', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/actions/callback');
	});

	it('should call onActionCallback on the FormBuilder component', () => {
		cy.window().then(window => {
			// Callback to spy on
			window.handleActionCallbackFn = values => {};

			cy.spy(window, 'handleActionCallbackFn');

			expect(window.handleActionCallbackFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('[id="button"]').click().should(() => {
				expect(window.handleActionCallbackFn).to.have.callCount(1);
				expect(window.handleActionCallbackFn).to.be.calledWith('TEST_TYPE', 'TEST_DATA');
			});
		});
	});
});
