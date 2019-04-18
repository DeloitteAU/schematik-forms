context('Sanity check - Initial values', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/initial-values');
	});

	it('inputs should be prepopulated with initial values', () => {
		cy.get('[name="second"]').should('have.value', 'test');
		cy.get('[name="group.subgroup.first"]').should('have.value', 'nesting');
		cy.get('[name="group.subgroup.third"]').should('have.value', 'more nesting');
	});
});
