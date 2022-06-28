describe('Editor- Test text editor widget', () => {
    beforeEach(() => {
        //read login data from fixtures
        cy.fixture('login-data').then(function (testdata) {
            cy.login(testdata.email, testdata.password);
        });
        cy.wait(1000);
        cy.createAppIfEmptyDashboard();
        cy.wait(2000);
        cy.get('.badge').contains('Edit').click();
        cy.get('title').should('have.text', 'Insight - Dashboard');
    });

    it('should be able to drag and drop text-editor to canvas', () => {
        cy.get('input[placeholder="Search…"]').type('text editor');

        cy.get('.draggable-box').contains('Text Editor').drag('.real-canvas', { force: true, position: 'topLeft' });
    });
});
