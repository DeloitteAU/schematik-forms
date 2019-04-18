context('Sanity check - Rules with duplicate paths', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/duplicate-paths');
	});

	it('should hide the correct fields intially', () => {
		cy.get('[name="p0"]').should('exist');
		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('not.exist');
	});

	it('should show only one the duplicate fields at a time', () => {
		cy.get('[name="p0"]').should('exist');
		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('not.exist');

		cy.get('[name="p0"]').first().check();

		cy.get('[id="testForm.input2a"]').should('exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('not.exist');

		cy.get('[name="p0"]').last().check();

		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('exist');
		cy.get('[name="p3"]').should('not.exist');
	});

	it('should show the last text input regardless of which duplicate field is shown', () => {
		cy.get('[name="p0"]').should('exist');
		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('not.exist');

		cy.get('[name="p0"]').first().check();
		cy.get('[id="testForm.input2a"]').type('test').blur();

		cy.get('[id="testForm.input2a"]').should('exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('exist');

		cy.get('[name="p0"]').last().check();

		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('exist');
		cy.get('[name="p3"]').should('exist');

		cy.get('[id="testForm.input2b"]').type('not').blur();

		cy.get('[id="testForm.input2a"]').should('not.exist');
		cy.get('[id="testForm.input2b"]').should('exist');
		cy.get('[name="p3"]').should('not.exist');

		cy.get('[name="p0"]').first().check();

		cy.get('[id="testForm.input2a"]').should('exist');
		cy.get('[id="testForm.input2b"]').should('not.exist');
		cy.get('[name="p3"]').should('not.exist');
	});
});
