/// <reference types="cypress" />
/*
TODOS
check cookies etc....
*/
describe("user signup", () => {
  describe("signup error", () => {
    it("should display email error message if email taken", () => {
      cy.visit("/signup");
      cy.get("#username").type("user");
      cy.get("#email").type(Cypress.env("user1Email"));
      cy.get("#password").type("password123");
      cy.get("#passwordRepeat").type("password123");
      cy.get("#signup-btn").click({ force: true });
      cy.contains("Email is taken").should("exist");
    });
  });
  // describe("signup success", () => {
  //   it("should display success message on successful signup", () => {
  //     cy.visit("/signup");
  //     cy.get("#username").type("user");
  //     cy.get("#email").type(`${email}`);
  //     cy.get("#password").type("password123");
  //     cy.get("#passwordRepeat").type("password123");
  //     cy.get("#signup-btn").click({ force: true });
  //     cy.contains(`Email has been sent to ${email}. Follow the instruction to activate your account`).should("exist");
  //   });
  // });
});
