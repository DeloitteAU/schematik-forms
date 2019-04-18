const checkInitial = () => {
	cy.get('[name="radio.one"]').should('exist');
	cy.get('[name="radio.two"]').should('exist');
	cy.get('#section1').should('not.exist');
	cy.get('#section1a').should('not.exist');
	cy.get('#section1b').should('not.exist');
	cy.get('#section1bi').should('not.exist');
	cy.get('[name="radio.three"]').should('not.exist');
	cy.get('[name="text.two"]').should('not.exist');
};

context('Sanity check - Nested/section rules', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/nested');
	});

	it('should show the correct fields initially', () => {
		checkInitial();
	});

	it('section1 and it\'s children should only show when radio.one is `yes`', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();

		cy.get('#section1').should('exist');
		cy.get('#section1a').should('exist');
		cy.get('#section1b').should('not.exist');
		cy.get('#section1bi').should('not.exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="text.two"]').should('not.exist');
	});

	it('section1b and it\'s children should only show when radio.two is `yes`', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').first().check();

		cy.get('#section1').should('exist');
		cy.get('#section1a').should('exist');
		cy.get('#section1b').should('exist');
		cy.get('#section1bi').should('not.exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="text.two"]').should('not.exist');
	});

	it('section1bi and it\'s children should only show when radio.three is `yes`', () => {
		checkInitial();

		cy.get('[name="radio.one"]').first().check();
		cy.get('[name="radio.two"]').first().check();
		cy.get('[name="radio.three"]').first().check();

		cy.get('#section1').should('exist');
		cy.get('#section1a').should('exist');
		cy.get('#section1b').should('exist');
		cy.get('#section1bi').should('exist');
		cy.get('[name="radio.three"]').should('exist');
		cy.get('[name="text.two"]').should('exist');
	});
});
