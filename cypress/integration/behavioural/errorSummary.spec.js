context('Sanity check - Error summary', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/error-summary');
	});

	it('should not render an error summary initially', () => {
		cy.get('#error-summary').should('not.exist');
	});

	it('should render an error summary on submit', () => {
		cy.get('#submit-it').click();
		cy.get('#error-summary').should('exist');
	});

	it('should render an error summary with correct length, labels and messages', () => {
		cy.get('#submit-it').click();
		cy.get('[name="third"]').type('long string to trigger validation');
		cy.get('[name="third"]').blur();
		cy.get('.summary-item').should('have.length', 3);

		cy.get('.summary-item').eq(0).within(() => {
			cy.get('.id').should('contain', 'input1');
			cy.get('.label').should('contain', 'Dummy input #1');
			cy.get('.message').should('contain', 'Custom required message');
		});

		cy.get('.summary-item').eq(1).within(() => {
			cy.get('.id').should('contain', 'input2');
			cy.get('.label').should('contain', 'Custom error summary label');
			cy.get('.message').should('contain', 'This field is required');
		});

		cy.get('.summary-item').eq(2).within(() => {
			cy.get('.id').should('contain', 'input3');
			cy.get('.label').should('contain', 'Dummy input #3');
			cy.get('.message').should('contain', 'Value must be less than 10 characters long');
		});
	});
});
