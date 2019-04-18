context('Sanity check - Simple rule', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/custom-rule-conditions');
	});

	it('should hide the radio input intially', () => {
		cy.get('[name="number"]').should('exist');
		cy.get('[name="two"]').should('not.exist');
	});

	it('should hide the radio input when less than or equal to 50', () => {
		cy.get('[name="number"]').should('exist');
		cy.get('[name="two"]').should('not.exist');

		cy.get('[name="number"]').type('10').blur();
		cy.get('[name="two"]').should('not.exist');
	});

	it('should show the radio input when greater than 50', () => {
		cy.get('[name="number"]').should('exist');
		cy.get('[name="two"]').should('not.exist');

		cy.get('[name="number"]').type('51').blur();
		cy.get('[name="two"]').should('exist');

		cy.get('[name="number"]').clear().type('15').blur();
		cy.get('[name="two"]').should('not.exist');

		cy.get('[name="number"]').clear().type('kjabsdkjnads').blur();
		cy.get('[name="two"]').should('not.exist');
	});
});
