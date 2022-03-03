describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to Tuesday when clicked", () => {
    cy.get('li')
      .contains('[data-testid]', 'Tuesday')
      .click()
      .should("have.class", "day-list__item--selected");
  })
});