context('Sanity check - Actions - Set value', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/actions/set-value');
	});

	it('should change radio.two to \'yes\' when radio.one is changed to \'yes\'', () => {
		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');

		cy.get('[name="radio.one"]').last().check();

		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('be.checked');
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');

		cy.get('[name="radio.one"]').first().check();

		cy.get('[name="radio.one"]').first().should('be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="radio.two"]').first().should('be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');
	});

	it('should not be a two way binding', () => {
		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');

		cy.get('[name="radio.one"]').last().check();

		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('be.checked');
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');

		cy.get('[name="radio.one"]').first().check();

		cy.get('[name="radio.one"]').first().should('be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="radio.two"]').first().should('be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');

		cy.get('[name="radio.two"]').last().check();

		cy.get('[name="radio.one"]').first().should('be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('be.checked');
	});

	it('should be able to set value of multiple fields at the same time', () => {
		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('not.be.checked');
		cy.get('[name="radio.three"]').first().should('not.be.checked');
		cy.get('[name="radio.three"]').last().should('not.be.checked');
		cy.get('[name="text.one"]').last().should('have.value', '');

		cy.get('[name="radio.three"]').last().check();

		cy.get('[name="radio.two"]').first().should('not.be.checked');
		cy.get('[name="radio.two"]').last().should('be.checked');
		cy.get('[name="radio.three"]').first().should('not.be.checked');
		cy.get('[name="radio.three"]').last().should('be.checked');
		cy.get('[name="text.one"]').last().should('have.value', 'testing');
	});

	it('multiple setValue actions can be applied to a field', () => {
		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="text.one"]').last().should('have.value', '');

		cy.get('[name="text.one"]').type('match-one').blur();

		cy.get('[name="radio.one"]').first().should('be.checked');
		cy.get('[name="radio.one"]').last().should('not.be.checked');
		cy.get('[name="text.one"]').last().should('have.value', 'match-one');

		cy.get('[name="text.one"]').clear().type('match-two').blur();

		cy.get('[name="radio.one"]').first().should('not.be.checked');
		cy.get('[name="radio.one"]').last().should('be.checked');
		cy.get('[name="text.one"]').last().should('have.value', 'match-two');
	});
});
