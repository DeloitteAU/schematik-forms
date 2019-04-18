context('Sanity check - doNotSubmit property', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/do-not-submit');
	});

	it('the form is submitted with doNotSubmit fields excluded', () => {
		cy.get('[name="group.first"]').type('one');
		cy.get('[name="group.second"]').type('two');
		cy.get('[name="third"]').eq(0).type('three');

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
				expect(window.handleSubmitFn).to.be.calledWith({
					group: {
						second: 'two',
					},
				});
			});
		});
	});
});
