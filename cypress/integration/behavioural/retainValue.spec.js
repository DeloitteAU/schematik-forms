context('Sanity check - Retain values on show/hide', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/rules/retain-values');
	});

	it('should only retain values for fields with `retainValue` set to true', () => {
		cy.get('[name="control.one"]').first().check();

		cy.get('[id="testForm.retains"] input').first().check();
		cy.get('[name="notRetains"]').first().check();
		cy.get('[name="textRetains"]').type('testValue');

		cy.get('[name="control.one"]').last().check();

		cy.get('[id="testForm.retains"]').should('not.exist');
		cy.get('[name="notRetains"]').should('not.exist');
		cy.get('[name="textRetains"]').should('not.exist');

		cy.get('[name="control.one"]').first().check();

		cy.get('[id="testForm.retains"] input').first().should('be.checked');
		cy.get('[name="notRetains"]').first().should('not.be.checked');
		cy.get('[name="notRetains"]').last().should('not.be.checked');
		cy.get('[name="textRetains"]').should('have.value', 'testValue');
	});

	it('should should not remove value if there is a field with the same path still visible', () => {
		cy.get('[name="control.one"]').first().check();
		cy.get('[name="control.two"]').first().check();

		cy.get('[id="testForm.retains"] input').first().check();

		cy.get('[id="testForm.retains"] input').first().should('be.checked');
		cy.get('[id="testForm.retainsDuplicate"] input').first().should('be.checked');

		cy.get('[name="control.two"]').last().check();

		cy.get('[id="testForm.retains"] input').first().should('be.checked');
		cy.get('[id="testForm.retainsDuplicate"]').should('not.exist');
	});
});
