import {
  usernameRegisterSelector,
  emailRegisterSelector,
  firstPasswordRegisterSelector,
  secondPasswordRegisterSelector,
  submitRegisterSelector,
  classInvalid,
  classValid,
} from '../../support/commands';

describe('/account/register', () => {
  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.visit('');
    cy.clickOnRegisterItem();
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '/api/register').as('registerSave');
  });

  it('should load the register page', () => {
    cy.get(submitRegisterSelector).should('be.visible');
  });

  it('requires username', () => {
    cy.get(usernameRegisterSelector).should('have.class', classInvalid).type('test').should('have.class', classValid).clear();
  });

  it('requires email', () => {
    cy.get(emailRegisterSelector).should('have.class', classInvalid).type('testtest.fr').should('have.class', classInvalid).clear();
  });

  it('requires email in correct format', () => {
    cy.get(emailRegisterSelector).should('have.class', classInvalid).type('test@test.fr').should('have.class', classValid).clear();
  });

  it('requires first password', () => {
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid).type('test@test.fr').should('have.class', classValid).clear();
  });

  it('requires password and confirm password to be same', () => {
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid).type('test').should('have.class', classValid);
    cy.get(secondPasswordRegisterSelector).should('have.class', classInvalid).type('test').should('have.class', classValid);
    cy.get(firstPasswordRegisterSelector).clear();
    cy.get(secondPasswordRegisterSelector).clear();
  });

  it('requires password and confirm password have not the same value', () => {
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid).type('test').should('have.class', classValid);
    cy.get(secondPasswordRegisterSelector).should('have.class', classInvalid).type('otherPassword').should('have.class', classInvalid);
    cy.get(firstPasswordRegisterSelector).clear();
    cy.get(secondPasswordRegisterSelector).clear();
  });

  it('register a valid user', () => {
    const randomEmail = 'Pamela61@hotmail.com';
    const randomUsername = 'Maximillia91';
    cy.get(usernameRegisterSelector).type(randomUsername);
    cy.get(emailRegisterSelector).type(randomEmail);
    cy.get(firstPasswordRegisterSelector).type('jondoe');
    cy.get(secondPasswordRegisterSelector).type('jondoe');
    cy.get(submitRegisterSelector).click({ force: true });
    cy.wait('@registerSave').its('status').should('equal', 201);
  });
});
