/// <reference types="cypress" />

describe("user login", () => {
  describe("login error", () => {
    it("should display email error message if email not found", () => {
      cy.visit("/login");
      cy.getByType("email").type("unknown@mail.com");
      cy.getByType("password").type("password");
      cy.get("#login-btn").click({ force: true });
      cy.contains("Email not found").should("exist");
    });
    it("should display password error message if password not found", () => {
      cy.visit("/login");
      cy.getByType("email").type(Cypress.env("user1Email"));
      cy.getByType("password").type("incorrectpassword");
      cy.get("#login-btn").click({ force: true });
      cy.contains("Email and Password do not match").should("exist");
    });
  });
  describe("login success", () => {
    it("should direct logged in user with subscriber role to dashboard page", () => {
      cy.visit("/login");
      cy.getByType("email").type(Cypress.env("user1Email"));
      cy.getByType("password").type(Cypress.env("user1Password"));
      cy.get("#login-btn").click({ force: true });
      cy.url().should("include", "/dashboard");
    });
    it("should direct logged in user with admin role to admin page", () => {
      cy.visit("/login");
      cy.getByType("email").type(Cypress.env("user2Email"));
      cy.getByType("password").type(Cypress.env("user2Password"));
      cy.get("#login-btn").click({ force: true });
      cy.url().should("include", "/admin");
    });
  });
});
