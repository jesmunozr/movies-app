describe('Movie List Page', () => {
  it('Should display movies based on search query', () => {
    cy.visit('/');
    cy.get('[data-cy="search-input"]')
        .type('Inception')
        .press('Enter');
    cy.get('[data-cy="movie-title"]').should('contain.text', 'Inception');
    cy.url().should('include', 'search=Inception');
  });

  it('Should update URL parameters when genre filter is changed', () => {
    cy.visit('/');
    cy.get('[data-cy="genre-option"]').contains('Action').click();
    cy.url().should('include', 'filter=action');
  });

  it('Should update URL parameters when sort option is changed', () => {
    cy.visit('/');
    cy.get('[data-cy="sort-select"]').select('RELEASE DATE');
    cy.url().should('include', 'sortBy=releaseDate');
  });

});