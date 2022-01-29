/// <reference types="cypress" />

beforeEach(() => {
  cy.visit("/signup");
});

describe("signup locator", () => {
  it("should have an email and password input", () => {
    cy.get("#username").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.get("#passwordRepeat").should("exist");
    cy.getByType("text").should("exist");
    cy.getByType("password").should("exist");
  });
  it("should have a signup button", () => {
    cy.get("button").should("exist");
    cy.contains("Sign Up").should("exist");
  });
  it("should have signup button disabled", () => {
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after invalid username", () => {
    cy.get("#username").type(".", { force: true });
    cy.get("#email").type("user@mail.com", { force: true });
    cy.get("#password").type("P4ssword", { force: true });
    cy.get("#passwordRepeat").type("P4ssword", { force: true });
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after invalid email", () => {
    cy.get("#username").type("user1", { force: true });
    cy.get("#email").type("inv", { force: true });
    cy.get("#password").type("P4ssword", { force: true });
    cy.get("#passwordRepeat").type("P4ssword", { force: true });
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after invalid password", () => {
    cy.get("#username").type("user1", { force: true });
    cy.get("#email").type("user@mail.com", { force: true });
    cy.get("#password").type("inv", { force: true });
    cy.get("#passwordRepeat").type("inv", { force: true });
    cy.get("button").should("be.disabled");
  });
  it("should have login button disabled after non matching passwords", () => {
    cy.get("#username").type("user1", { force: true });
    cy.get("#email").type("user@mail.com", { force: true });
    cy.get("#password").type("P4ssword", { force: true });
    cy.get("#passwordRepeat").type("P4ssword1", { force: true });
    cy.get("button").should("be.disabled");
  });

  it("should have login button enabled after valid inputs", () => {
    cy.get("#username").type("user1", { force: true });
    cy.get("#email").type("user@mail.com", { force: true });
    cy.get("#password").type("P4ssword", { force: true });
    cy.get("#passwordRepeat").type("P4ssword", { force: true });
    cy.get("button").should("be.enabled");
  });
  it("should take user to login page after clicking login link", () => {
    cy.contains("Already have an account? Log in").click({ force: true });
    cy.url().should("include", "/login");
  });
});
