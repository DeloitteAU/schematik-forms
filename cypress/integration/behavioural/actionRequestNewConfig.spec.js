context('Sanity check - Actions - Request new config', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/actions/request-new-config');
	});

	it('should update to use a new config when radio.one is changed to \'yes\'', () => {
		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="new"]').should('not.exist');

		cy.get('[name="radio.one"]').first().check();

		cy.wait(500);

		cy.get('[name="radio.one"]').first().should('be.checked');
		cy.get('[name="new"]').should('exist');
		cy.get('[name="new"]').should('have.value', 'test data from old config');
	});

	it('should support updating fields to a new type', () => {
		cy.get('[name="willchangetype"]').should('exist');
		cy.get('[name="willchangetype"]').should('have.attr', 'type', 'text');

		cy.get('[name="willchangetype"]').type('no');
		cy.get('[name="radio.one"]').first().check();

		cy.wait(500);

		cy.get('[name="willchangetype"]').should('exist');
		cy.get('[name="willchangetype"]').first().should('have.attr', 'type', 'radio');
		cy.get('[name="willchangetype"]').last().should('have.attr', 'type', 'radio');
		cy.get('[name="willchangetype"]').last().should('be.checked');

		// Change it back again
		cy.get('[name="willchangetype"]').first().check();
		cy.get('[name="radio.one"]').last().check();

		cy.get('[name="willchangetype"]').should('exist');
		cy.get('[name="willchangetype"]').should('have.attr', 'type', 'text');
		cy.get('[name="willchangetype"]').should('have.value', 'yes');
	});

	it('should reflect the initialErrors of the new config', () => {
		cy.get('.error').should('have.length', 0);

		cy.get('[name="radio.one"]').first().check();
		cy.wait(500);

		cy.get('.error').eq(0).should('contain', 'test server error');

		cy.get('[name="radio.one"]').last().check();
		cy.wait(500);

		cy.get('.error').should('have.length', 0);
	});

});
