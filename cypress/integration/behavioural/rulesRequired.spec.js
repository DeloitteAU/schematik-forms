context('Sanity check - Required property rule', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/required');
	});

	it('should not require the text input intially', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);
	});

	it('should require the text input when `yes` is selected', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);

		cy.get('[name="group.first"]').first().check();

		cy.get('[name="group.second"]').should('to.have.prop', 'required', true);
	});

	it('should not require the text input when `no` is selected', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);

		cy.get('[name="group.first"]').last().check();

		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);
	});

	it('should handle toggling back and forth between `yes` and `no`', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'required', true);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'required', true);

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'required', false);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'required', true);
	});

	it('validation should work correctly', () => {
		cy.get('#submit-it').click();

		cy.get('.error').should('have.length', 1);

		cy.get('[name="group.first"]').first().check();

		cy.get('.error').should('have.length', 2);
	});

	it('should not depend on the order of fields', () => {
		cy.get('[name="order.one"]').should('to.have.prop', 'required', false);

		cy.get('[name="order.two"]').last().check();
		cy.get('[name="order.one"]').should('to.have.prop', 'required', true);

		cy.get('[name="order.two"]').first().check();
		cy.get('[name="order.one"]').should('to.have.prop', 'required', false);
	});
});
