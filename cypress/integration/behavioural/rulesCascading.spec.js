const checkInitial = () => {
	cy.get('[name="radio.one"]').should('exist');
	cy.get('[name="radio.two"]').should('not.exist');
	cy.get('[name="radio.three"]').should('not.exist');
	cy.get('[name="input"]').should('not.exist');
};

context('Sanity check - Cascading rules', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/cascade');
	});

	it('should only show the top radio button intially', () => {
		checkInitial();
	});

	it('should show the second radio when the first `yes` is selected', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('exist');
		cy.get('[name="radio.three"]').should('not.exist');
		cy.get('[name="input"]').should('not.exist');
	});

	it('should show the third radio when the first and second `yes` is selected', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').first().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="input"]').should('not.exist');
	});

	it('should show the text input when the first, second and third `yes` is selected', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').first().check();
		cy.get('[name="radio.three"]').first().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="input"]').should('exist');
	});

	it('should hide everything when the first `no` is selected', () => {
		checkInitial();

		cy.get('[name="radio.one"]').last().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('not.exist');
		cy.get('[name="radio.three"]').should('not.exist');
		cy.get('[name="input"]').should('not.exist');
	});

	it('should hide everything when the first `no` is selected after initially choosing `yes` to everything', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').first().check();
		cy.get('[name="radio.three"]').first().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="input"]').should('exist');

		cy.get('[name="radio.one"]').last().check();

		cy.get('[name="radio.one"]').should('exist');
		cy.get('[name="radio.two"]').should('not.exist');
		cy.get('[name="radio.three"]').should('not.exist');
		cy.get('[name="input"]').should('not.exist');
	});
});
