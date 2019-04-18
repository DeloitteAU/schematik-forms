context('Sanity check - Basic form', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/context');
	});

	it('rules should not use context if the path is used by the form', () => {
		cy.get('[name="valueOne"]').should('exist');
		cy.get('[name="valueTwo"]').should('not.exist');
		cy.get('[name="valueThree"]').should('not.exist');
		cy.get('[name="valueFour"]').should('not.exist');
	});

	it('rules should use context when they evaluate conditions', () => {
		cy.get('[name="valueOne"]').should('exist');
		cy.get('[name="valueTwo"]').should('not.exist');
		cy.get('[name="valueThree"]').should('not.exist');
		cy.get('[name="valueFour"]').should('not.exist');

		cy.get('[name="valueOne"]').first().check();

		cy.get('[name="valueOne"]').should('exist');
		cy.get('[name="valueTwo"]').should('exist');
		cy.get('[name="valueThree"]').should('not.exist');
		cy.get('[name="valueFour"]').should('not.exist');

		cy.get('[name="valueTwo"]').first().check();

		cy.get('[name="valueOne"]').should('exist');
		cy.get('[name="valueTwo"]').should('exist');
		cy.get('[name="valueThree"]').should('exist');
		cy.get('[name="valueFour"]').should('not.exist');
	});
});
