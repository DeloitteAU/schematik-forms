context('Sanity check - External errors', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/external-errors');
	});

	it('should render external errors initially', () => {
		cy.get('.error').should('have.length', 2);
		cy.get('.error').eq(0).should('contain', 'External error 1');
		cy.get('.error').eq(1).should('contain', 'External error 2');
	});

	it('should clear external errors on submit', () => {
		cy.get('.dummy-input input').eq(2).type('{enter}');
		cy.get('.error').should('have.length', 3);
		cy.get('.error').eq(0).should('contain', 'Custom required message');
		cy.get('.error').eq(1).should('contain', 'Custom required message');
		cy.get('.error').eq(2).should('contain', 'Custom required message');
	});

	it('should clear external errors on blur', () => {
		cy.get('[name="group.first"]').focus();

		cy.get('.error').should('have.length', 2);
		cy.get('.error').eq(0).should('contain', 'External error 1');
		cy.get('.error').eq(1).should('contain', 'External error 2');

		cy.get('[name="group.first"]').blur();

		cy.get('.error').should('have.length', 2);
		cy.get('.error').eq(0).should('contain', 'Custom required message');
		cy.get('.error').eq(1).should('contain', 'External error 2');

		cy.get('[name="group.second"]').focus();

		cy.get('.error').should('have.length', 2);
		cy.get('.error').eq(0).should('contain', 'Custom required message');
		cy.get('.error').eq(1).should('contain', 'External error 2');

		cy.get('[name="group.second"]').blur();

		cy.get('.error').should('have.length', 2);
		cy.get('.error').eq(0).should('contain', 'Custom required message');
		cy.get('.error').eq(1).should('contain', 'Custom required message');
	});

});
