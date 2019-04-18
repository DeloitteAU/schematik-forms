const checkInitial = () => {
	cy.get('[name="radio.one"]').should('exist');
	cy.get('[name="radio.two"]').should('exist');
	cy.get('#section1').should('not.exist');
	cy.get('#section1a').should('not.exist');
	cy.get('#section1b').should('not.exist');
	cy.get('#section1bi').should('not.exist');
	cy.get('[name="radio.three"]').should('not.exist');
	cy.get('[name="text.two"]').should('not.exist');
};

context('Sanity check - Rules and validation', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/with-validation');
	});

	it('should show the correct fields initially', () => {
		checkInitial();
	});

	it('should be submittable by default and contain no errors', () => {
		checkInitial();

		cy.get('.error').should('have.length', 0);

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

	it('should have an error when radio.one is `yes`', () => {
		checkInitial();

		cy.get('.error').should('have.length', 0);

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="text.one"]').focus().blur();

		cy.get('.error').should('have.length', 1);

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(0);
			});

			cy.get('[name="radio.one"]').last().check();
			cy.get('.error').should('have.length', 0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
			});

			cy.get('[name="radio.one"]').first().check();
			cy.get('[name="text.one"]').focus().blur();
			cy.get('.error').should('have.length', 1);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
			});
		});
	});

	it('should have an error when all radios are `yes`', () => {
		checkInitial();

		cy.get('.error').should('have.length', 0);

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="text.one"]').focus().blur();

		cy.get('.error').should('have.length', 1);

		cy.get('[name="radio.two"]').first().check();

		cy.get('.error').should('have.length', 1);

		cy.get('[name="radio.three"]').first().check();
		cy.get('[name="text.two"]').focus().blur();

		cy.get('.error').should('have.length', 2);

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(0);
			});

			cy.get('[name="radio.one"]').last().check();
			cy.get('.error').should('have.length', 0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
			});

			cy.get('[name="radio.one"]').first().check();
			cy.get('[name="radio.two"]').first().check();
			cy.get('[name="radio.three"]').first().check();
			cy.get('[name="text.one"]').focus().blur();
			cy.get('[name="text.two"]').focus().blur();
			cy.get('.error').should('have.length', 2);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
			});
		});
	});
});
