context('Sanity check - Nested form fields', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/nested');
	});

	it('should render a form element', () => {
		cy.get('form').should($form => {
			expect($form).to.exist;
		});
	});

	it('should render five inputs', () => {
		cy.get('.dummy-input').should($inputs => {
			expect($inputs).to.have.length(5);
		});
	});

	it('should render three sections', () => {
		cy.get('.dummy-section').should($inputs => {
			expect($inputs).to.have.length(3);
		});
	});

	it('should render nested fields correctly', () => {
		cy.get('#section1')
			.find('input')
			.should('have.length', 4);

		cy.get('#section2')
			.find('input')
			.should('have.length', 3);

		cy.get('#section3')
			.find('input')
			.should('have.length', 2);
	});

	it('the form can be submitted', () => {
		const expectedValues = {
			first: '',
			second: '',
			group: {
				third: '',
				subgroup: {
					fifth: '',
				},
			},
			fourth: '',
		};

		cy.window().then(window => {
			// Callback to spy on
			window.handleSubmitFn = values => {};

			cy.spy(window, 'handleSubmitFn');

			expect(window.handleSubmitFn).to.have.callCount(0);

			// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
			cy.get('#submit-it').click().should(() => {
				expect(window.handleSubmitFn).to.have.callCount(1);
				expect(window.handleSubmitFn).to.be.calledWith(expectedValues);
			});
		});
	});

	describe('inputs can be typed into', () => {
		const expectedValues = {
			first: 'one',
			second: 'two',
			group: {
				third: 'three',
				subgroup: {
					fifth: 'five',
				},
			},
			fourth: 'four',
		};

		beforeEach(() => {
			cy.get('[name="first"]').type(expectedValues.first);

			cy.get('[name="group.subgroup.fifth"]').type(expectedValues.group.subgroup.fifth);

			cy.get('[name="second"]').type(expectedValues.second);

			cy.get('[name="group.third"]').type(expectedValues.group.third);
			cy.get('[name="fourth"]').type(expectedValues.fourth);
		});


		it('and the inputs reflect that', () => {
			cy.get('[name="first"]').should('have.value', expectedValues.first);

			cy.get('[name="group.subgroup.fifth"]').should('have.value', expectedValues.group.subgroup.fifth);

			cy.get('[name="second"]').should('have.value', expectedValues.second);

			cy.get('[name="group.third"]').should('have.value', expectedValues.group.third);
			cy.get('[name="fourth"]').should('have.value', expectedValues.fourth);
		});

		it('and that is reflected on submit', () => {
			cy.window().then(window => {
				// Callback to spy on
				window.handleSubmitFn = values => {};

				cy.spy(window, 'handleSubmitFn');

				expect(window.handleSubmitFn).to.have.callCount(0);

				// Simply calling .submit() doesn't quite work in react land, so trigger submit via a button.
				cy.get('#submit-it').click().should(() => {
					expect(window.handleSubmitFn).to.have.callCount(1);
					expect(window.handleSubmitFn).to.be.calledWith(expectedValues);
				});
			});
		});
	});
});
