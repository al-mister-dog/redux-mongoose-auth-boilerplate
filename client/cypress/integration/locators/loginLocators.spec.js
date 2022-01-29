/// <reference types="cypress" />

beforeEach(() => {
  cy.visit("/login");
});

describe("login locator", () => {
  it("should have an email and password input", () => {
    cy.getByType("email").should("exist");
    cy.getByType("password").should("exist");
  });
  it("should have a login button", () => {
    cy.get("button").should("exist");
    cy.contains("Log In").should("exist");
  });
  it("should have a remember-me checkbox", () => {
    cy.getByTestId("checkbox");
    cy.contains("Remember me");
  });
  it("should have login button disabled", () => {
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after invalid inputs", () => {
    cy.getByType("email").type("user@mail.com");
    cy.getByType("password").type("inv");
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after invalid password inputs", () => {
    cy.getByType("email").type("inv");
    cy.getByType("password").type("P4ssword");
    cy.get("button").should("be.disabled");
  });
  it("should have login button enabled after valid inputs", () => {
    cy.getByType("email").type("user@mail.com");
    cy.getByType("password").type("P4ssword");
    cy.get("button").should("be.enabled");
  });
  it("should take user to login page after clicking login link", () => {
    cy.contains("Don't have an account? Sign Up").click({ force: true })
    cy.url().should('include', '/signup')
  });
});
