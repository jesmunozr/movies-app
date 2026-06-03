
const createTestMovie = () => {
  cy.get('[data-cy="add-movie-button"]').click();
    
  cy.url().should('include', '/new');

  cy.get('[data-cy="movie-title-input"]').type('Test Movie');
  cy.get('[data-cy="movie-release-date-input"]').type('2001-12-19');
  cy.get('[data-cy="movie-url-input"]').type('https://example.com/lotr-poster.jpg');
  cy.get('[data-cy="movie-rating-input"]').clear().type('8.8');
  const selectGenres = cy.get('.select-genres__control');
  selectGenres.click();
  cy.get('.select-genres__option').contains('Action').click();
  selectGenres.click();
  cy.get('.select-genres__option').contains('Adventure').click();
  cy.get('[data-cy="movie-runtime-input"]').clear().type('178');
  cy.get('[data-cy="movie-overview-input"]').type('An epic fantasy adventure film based on the novel by J.R.R. Tolkien.');
  cy.get('[data-cy="movie-submit-button"]').click();
};

const deleteTestMovie = () => {
  cy.get('[data-cy="search-input"]').clear().type('Test Movie').press('Enter');
  cy.get('[data-cy="movie-title"]')
    .should('contain.text', 'Test Movie')
    .closest('.movie-tile')
    .children('[data-cy=movie-options-button]')
    .click();
  cy.get('[data-cy="movie-delete-button"]').click();

  cy.url().should('include', '/delete');
  cy.get('[data-cy="delete-button"]').click();
};

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

  it("Should add a movie and depict it in the list", () => {
    cy.visit('/?search=Test%20Movie');

    createTestMovie();

    cy.url().should('not.include', '/new');
    cy.get('[data-cy="movie-title"]').should('contain.text', 'Test Movie');

    deleteTestMovie();

  });

  it("Should look for a movie and edit it", () => {
    cy.visit('/');

    createTestMovie();

    cy.get('[data-cy="search-input"]').type('Test Movie').press('Enter');
    cy.get('[data-cy="movie-title"]')
      .should('contain.text', 'Test Movie')
      .closest('.movie-tile')
      .children('[data-cy=movie-options-button]')
      .click();
    cy.get('[data-cy="movie-edit-button"]').click();
    
    cy.url().should('include', '/edit');

    cy.get('[data-cy="movie-title-input"]').should('contain.value', 'Test Movie').clear().type('Test Movie');
    cy.get('[data-cy="movie-submit-button"]').click();

    cy.url().should('not.include', '/edit');
    cy.get('[data-cy="movie-title"]').should('contain.text', 'Test Movie');

    deleteTestMovie();
  });

  it("Should look for a movie and delete it", () => {
    cy.visit('/');

    createTestMovie();

    deleteTestMovie();

    cy.url().should('not.include', '/delete');
    cy.get('[data-cy="movie-title"]').should('not.exist');
  });

});