context('Sanity check - Disabled property rule', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/disabled');
	});

	it('should enable the text input intially', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);
	});

	it('disable the text input when `yes` is selected', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="group.first"]').first().check();

		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', true);
	});

	it('should enable the text input when `no` is selected', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="group.first"]').last().check();

		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);
	});

	it('should handle toggling back and forth between `yes` and `no`', () => {
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', true);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', true);

		cy.get('[name="group.first"]').last().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="group.first"]').first().check();
		cy.get('[name="group.second"]').should('to.have.prop', 'disabled', true);
	});

	it('should respect the fields disabled property', () => {
		cy.get('[name="alwaysdisabled"]').should('to.have.prop', 'disabled', true);
	});

	it('should not depend on the order of fields', () => {
		cy.get('[name="order.one"]').should('to.have.prop', 'disabled', false);

		cy.get('[name="order.two"]').last().check();
		cy.get('[name="order.one"]').should('to.have.prop', 'disabled', true);

		cy.get('[name="order.two"]').first().check();
		cy.get('[name="order.one"]').should('to.have.prop', 'disabled', false);
	});
});
