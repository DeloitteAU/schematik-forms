context('Sanity check - Basic form', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/basic');
	});

	it('should render a form element', () => {
		cy.get('form').should($form => {
			expect($form).to.exist;
		});
	});

	it('should render three inputs', () => {
		cy.get('.dummy-input').should($inputs => {
			expect($inputs).to.have.length(3);
		});
	});

	it('the form can be submitted', () => {
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
						first: '',
						second: '',
					},
					third: '',
				});
			});
		});
	});

	describe('inputs can be typed into', () => {
		beforeEach(() => {
			cy.get('.dummy-input input').eq(0).type('one');
			cy.get('.dummy-input input').eq(1).type('two');
			cy.get('.dummy-input input').eq(2).type('three');
		});


		it('and the inputs reflect that', () => {
			cy.get('.dummy-input input').eq(0).should('have.value', 'one');
			cy.get('.dummy-input input').eq(1).should('have.value', 'two');
			cy.get('.dummy-input input').eq(2).should('have.value', 'three');
		});

		it('and that is reflected on submit when clicking submit button', () => {
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
							first: 'one',
							second: 'two',
						},
						third: 'three',
					});
				});
			});
		});

		it('and that is reflected on submit when pressing enter on field ', () => {
			cy.window().then(window => {
				// Callback to spy on
				window.handleSubmitFn = values => {};

				cy.spy(window, 'handleSubmitFn');

				expect(window.handleSubmitFn).to.have.callCount(0);

				cy.get('.dummy-input input').eq(2).type('{enter}').should(() => {
					expect(window.handleSubmitFn).to.have.callCount(1);
					expect(window.handleSubmitFn).to.be.calledWith({
						group: {
							first: 'one',
							second: 'two',
						},
						third: 'three',
					});
				});
			});
		});
	});
});
