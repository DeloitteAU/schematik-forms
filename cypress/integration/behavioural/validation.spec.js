context('Sanity check - Validation', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/validation/basic');
	});

	it('no errors should be shown for valid inputs', () => {
		cy.get('[name="group.first"]').type('abcd');
		cy.get('[name="third"]').type('matches');
		cy.get('[name="fourth"]').type('abc def');
		cy.get('[name="group.second"]').type('matches');
		cy.get('[name="nested.first"]').type('otherMatches');
		cy.get('[name="nested.again.second"]').type('otherMatches');
		cy.get('[name="sixth"]').type('any value');
		cy.get('[name="sixth"]').blur();

		cy.get('.error').should('have.length', 0);
	});

	it('errors should be shown for invalid inputs', () => {
		cy.get('[name="group.first"]').type('abcdefghijklmno');
		cy.get('[name="third"]').type('matches');
		cy.get('[name="fourth"]').type('abc def 23 long string');
		cy.get('[name="group.second"]').type('matchs');
		cy.get('[name="nested.first"]').type('abc def');
		cy.get('[name="nested.again.second"]').type('jj3jjj');
		cy.get('[name="nested.again.second"]').blur();

		// cy.get('.error').should('have.length', 3)

		cy.get('[name="group.first"] + .error').contains('Value must be less than 10 characters long');
		cy.get('[name="nested.again.second"] + .error').contains('Shouldn\'t contain numbers');
		cy.get('[name="nested.first"] + .error').contains('Doesn\'t match other field');
		cy.get('[name="third"] + .error').contains('Doesn\'t match other field');
		cy.get('[name="fourth"] + .error').contains('Value must be less than 10 characters long');
		cy.get('[name="fourth"] + .error + .error').contains('Value must not contain numbers');
	});

	it('errors are removed when fixed', () => {
		cy.get('[name="group.first"]').type('abcdefghijklmno');
		cy.get('[name="third"]').type('matches');
		cy.get('[name="fourth"]').type('abc def 23 long string');
		cy.get('[name="group.second"]').type('matchs');
		cy.get('[name="nested.first"]').type('abc def');
		cy.get('[name="nested.again.second"]').type('jj3jjj');
		cy.get('[name="nested.again.second"]').blur();

		cy.get('[name="group.first"] + .error').contains('Value must be less than 10 characters long');
		cy.get('[name="nested.again.second"] + .error').contains('Shouldn\'t contain numbers');
		cy.get('[name="nested.first"] + .error').contains('Doesn\'t match other field');
		cy.get('[name="third"] + .error').contains('Doesn\'t match other field');
		cy.get('[name="fourth"] + .error').contains('Value must be less than 10 characters long');
		cy.get('[name="fourth"] + .error + .error').contains('Value must not contain numbers');

		cy.get('[name="group.first"]').clear().type('abcd');
		cy.get('[name="third"]').clear().type('matches');
		cy.get('[name="fourth"]').clear().type('abc def');
		cy.get('[name="group.second"]').clear().type('matches');
		cy.get('[name="nested.first"]').clear().type('otherMatches');
		cy.get('[name="nested.again.second"]').clear().type('otherMatches');
		cy.get('[name="sixth"]').type('any value');
		cy.get('[name="sixth"]').blur();

		cy.get('.error').should('have.length', 0);
	});

	it('a valid form can submit', () => {
		cy.get('[name="group.first"]').type('abcd');
		cy.get('[name="third"]').type('matches');
		cy.get('[name="fourth"]').type('abc def');
		cy.get('[name="group.second"]').type('matches');
		cy.get('[name="nested.first"]').type('otherMatches');
		cy.get('[name="nested.again.second"]').type('otherMatches');
		cy.get('[name="sixth"]').type('any value');

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
			});
		});
	});

	it('an invalid form cannot submit', () => {
		cy.get('[name="group.first"]').type('abcdefghijklmno');

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(0);
			});
		});
	});
});
