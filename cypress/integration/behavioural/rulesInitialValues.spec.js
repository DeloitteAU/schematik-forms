const checkInitial = () => {
	cy.get('[name="radio.one"]').should('exist');
	cy.get('[name="radio.one"]').first().should('be.checked');
	cy.get('[name="radio.one"]').last().should('not.be.checked');
	cy.get('[name="radio.two"]').should('exist');
	cy.get('[name="radio.two"]').first().should('not.be.checked');
	cy.get('[name="radio.two"]').last().should('be.checked');
	cy.get('[name="text.one"]').should('exist');
	cy.get('[name="text.one"]').should('have.value', 'initial 1');
	cy.get('[name="text.two"]').should('not.exist');
};

context('Sanity check - Rules with initial values', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/with-initial-values');
	});

	it('should show the correct fields initially', () => {
		checkInitial();
	});

	it('should show the text input when radio.two is yes, and it should have the correct initial value', () => {
		checkInitial();

		cy.get('[name="radio.two"]').first().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('exist');
		cy.get('[name="text.one"]').should('exist');
		cy.get('[name="text.two"]').should('exist');
		cy.get('[name="text.two"]').should('have.value', 'initial 2');
	});
});
