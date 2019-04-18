context('Sanity check - Simple rule', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/simple');
	});

	it('should hide the text input intially', () => {
		cy.get('[name="group.second"]').should('not.exist');
	});

	it('should show the text input when `yes` is selected', () => {
		cy.get('[name="group.second"]').should('not.exist');

		cy.get('[name="group.first"]').first().check();

		cy.get('[name="group.second"]').should('exist');
	});

	it('should hide the text input when `no` is selected', () => {
		cy.get('[name="group.second"]').should('not.exist');

		cy.get('[name="group.first"]').last().check();

		cy.get('[name="group.second"]').should('not.exist');
	});

	it('should handle toggling back and forth between `yes` and `no`', () => {
		cy.get('[name="group.second"]').should('not.exist');

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('not.exist');

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('exist');

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('exist');

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('not.exist');

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('exist');
	});

	it('should not depend on the order of fields', () => {
		cy.get('[name="order.one"]').should('not.exist');

		cy.get('[name="order.two"]').last().check();
		cy.get('[name="order.one"]').should('exist');

		cy.get('[name="order.two"]').first().check();
		cy.get('[name="order.one"]').should('not.exist');
	});
});
