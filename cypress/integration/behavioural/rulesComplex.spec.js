const checkInitial = () => {
	cy.get('[name="radio.one"]').should('exist');
	cy.get('[name="text.one"]').should('exist');
	cy.get('[name="radio.two"]').should('not.exist');
	cy.get('[name="radio.four"]').should('not.exist');
	cy.get('[name="text.two"]').should('not.exist');
};

context('Sanity check - Complex rules', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/complex');
	});

	it('should show the correct fields initially', () => {
		checkInitial();
	});

	it('radio.two should only show when radio.one is `yes` and text.one is `match`', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').should('not.exist');

		cy.get('[name="text.one"]').type('match');
		cy.get('[name="text.one"]').blur();
		cy.get('[name="radio.two"]').should('exist');

		cy.get('[name="radio.one"]').last().check();
		cy.get('[name="radio.two"]').should('not.exist');
	});

	it('radio.four should show when radio.one is `yes` or text.one is `match`', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.four"]').should('exist');

		cy.get('[name="text.one"]').type('match');
		cy.get('[name="text.one"]').blur();
		cy.get('[name="radio.four"]').should('exist');

		cy.get('[name="radio.one"]').last().check();
		cy.get('[name="radio.four"]').should('exist');

		cy.get('[name="text.one"]').type('not');
		cy.get('[name="text.one"]').blur();
		cy.get('[name="radio.four"]').should('not.exist');
	});

	it('text.two should show when (radio.one === `yes` OR text.one === `match`) AND (radio.four !== `yes`)', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="text.two"]').should('exist');

		cy.get('[name="text.one"]').type('match');
		cy.get('[name="text.one"]').blur();
		cy.get('[name="text.two"]').should('exist');

		cy.get('[name="radio.one"]').last().check();
		cy.get('[name="text.two"]').should('exist');

		cy.get('[name="text.one"]').type('not');
		cy.get('[name="text.one"]').blur();
		cy.get('[name="text.two"]').should('not.exist');

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="text.two"]').should('exist');

		cy.get('[name="radio.four"]').first().check();
		cy.get('[name="text.two"]').should('not.exist');

		cy.get('[name="radio.four"]').last().check();
		cy.get('[name="text.two"]').should('exist');
	});
});
