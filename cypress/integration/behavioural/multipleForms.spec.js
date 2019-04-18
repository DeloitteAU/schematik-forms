context('Sanity check - Basic form', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/multiple-forms');
	});

	it('should render two forms', () => {
		cy.get('form').should('have.length', 2);
	});

	it('forms should have independant values', () => {
		cy.get('form').eq(0).find('[name="group.first"]').type('test value').blur();
		cy.get('form').eq(1).find('[name="group.first"]').should('have.value', '');

		cy.get('form').eq(1).find('[name="group.first"]').type('independant value').blur();
		cy.get('form').eq(0).find('[name="group.first"]').should('have.value', 'test value');
	});
});
