describe('Home Page', () => {
  it('Should change the counter after clicking the increment button', () => {
    cy.visit('/');
    cy.get('[data-cy="increment-button"]').click();
    cy.contains('Counter').should('have.text', 'Counter: 6');
  });

  it('Should change the counter after clicking the decrement button', () => {
    cy.visit('/');
    cy.get('[data-cy="decrement-button"]').click();
    cy.contains('Counter').should('have.text', 'Counter: 4');
  });
    
});