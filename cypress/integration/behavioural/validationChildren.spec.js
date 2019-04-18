context('Sanity check - Validation with children', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/validation/children');
	});

	it('initial/server errors are displayed correctly initially', () => {
		cy.get('#testForm\\.person1-error').should('contain', 'Field level server error');
		cy.get('#testForm\\.person1-given-error').should('contain', 'Given name server error');
		cy.get('#testForm\\.person1-family-error').should('contain', 'Family name server error');
	});

	it('internal validation errors are displayed correctly', () => {
		cy.get('#testForm\\.person2-error').should('be.empty');
		cy.get('#testForm\\.person2-given-error').should('be.empty');
		cy.get('#testForm\\.person2-family-error').should('be.empty');

		cy.get('#testForm\\.person2-given').type('John').blur();

		cy.get('#testForm\\.person2-error').should('contain', 'Name error');
		cy.get('#testForm\\.person2-given-error').should('contain', 'Given name cannot be John');
		cy.get('#testForm\\.person2-family-error').should('be.empty');

		cy.get('#testForm\\.person2-family').type('Smith').blur();

		cy.get('#testForm\\.person2-family-error').should('contain', 'Family name cannot be Smith');

		cy.get('#testForm\\.person2-given').clear().blur();

		cy.get('#testForm\\.person2-given-error').should('be.empty');

		cy.get('#testForm\\.person2-family').clear().blur();

		cy.get('#testForm\\.person2-family-error').should('be.empty');
		cy.get('#testForm\\.person2-error').should('be.empty');
	});
});
