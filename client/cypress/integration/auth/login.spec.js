/// <reference types="cypress" />

describe("user login", () => {
  describe("login error", () => {
    it("should display email error message if email not found", () => {
      cy.visit("/login");
      cy.getByType("email").type("unknown@mail.com");
      cy.getByType("password").type("P4ssword");
      cy.get("#login-btn").click({ force: true });
      cy.contains("Email not found").should('exist')
    });    
    it("should display password error message if email not found", () => {
      cy.visit("/login");
      cy.getByType("email").type("user1@mail.com");
      cy.getByType("password").type("incorrectpassword");
      cy.get("#login-btn").click({ force: true });
      cy.contains("Email and Password do not match").should('exist')
    });    
  })
  describe("login success", () => {
    it("should direct logged in user with subscriber role to dashboard page", () => {
      cy.visit("/login");
      cy.getByType("email").type("user1@mail.com");
      cy.getByType("password").type("P4ssword");
      cy.get("#login-btn").click({ force: true });
      cy.url().should("include", "/dashboard");
    });
    it("should direct logged in user with admin role to admin page", () => {
      cy.visit("/login");
      cy.getByType("email").type("user2@mail.com");
      cy.getByType("password").type("P4ssword");
      cy.get("#login-btn").click({ force: true });
      cy.url().should("include", "/admin");
    });
  });
});
