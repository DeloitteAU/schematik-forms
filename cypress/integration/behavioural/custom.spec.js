context('Sanity check - Custom form rendering', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/custom');
	});

	it('should render a form element with #customForm id', () => {
		cy.get('form#customForm').should($form => {
			expect($form).to.exist;
		});
	});

	it('should render a div with #fields id', () => {
		cy.get('div#fields').should($div => {
			expect($div).to.exist;
		});
	});

	it('should render a hr with #divider id', () => {
		cy.get('hr#divider').should($hr => {
			expect($hr).to.exist;
		});
	});

	it('should render a div with #buttons id', () => {
		cy.get('div#buttons').should($buttons => {
			expect($buttons).to.exist;
		});
	});

	it('should render a div with #error-summary id', () => {
		cy.get('div#error-summary').should($summary => {
			expect($summary).to.exist;
		});
	});

	it('should render three inputs', () => {
		cy.get('.dummy-input').should($inputs => {
			expect($inputs).to.have.length(3);
		});
	});

	it('should render a button with #custom-cancel id', () => {
		cy.get('button#custom-cancel').should($button => {
			expect($button).to.exist;
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
		let inputs;

		beforeEach(() => {
			const input1 = cy.get('.dummy-input input').eq(0).type('one');
			const input2 = cy.get('.dummy-input input').eq(1).type('two');
			const input3 = cy.get('.dummy-input input').eq(2).type('three');
		});


		it('and the inputs reflect that', () => {
			cy.get('.dummy-input input').eq(0).should('have.value', 'one');
			cy.get('.dummy-input input').eq(1).should('have.value', 'two');
			cy.get('.dummy-input input').eq(2).should('have.value', 'three');
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
