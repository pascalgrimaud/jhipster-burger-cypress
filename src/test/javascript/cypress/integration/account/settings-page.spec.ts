import { firstNameSettingsSelector, lastNameSettingsSelector, submitSettingsSelector, emailSettingsSelector } from '../../support/commands';

describe('/account/settings', () => {
  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.visit('');
    cy.login('user', 'user');
    cy.clickOnSettingsItem();
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '/api/account').as('settingsSave');
  });

  it("should be able to change 'user' firstname settings", () => {
    cy.get(firstNameSettingsSelector).clear().type('jhipster');
    // need to modify email because default email does not match regex in vue
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click({ force: true });
    cy.wait('@settingsSave').its('status').should('equal', 200);
  });

  it("should be able to change 'user' lastname settings", () => {
    cy.get(lastNameSettingsSelector).clear().type('retspihj');
    // need to modify email because default email does not match regex in vue
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click({ force: true });
    cy.wait('@settingsSave').its('status').should('equal', 200);
  });

  it("should be able to change 'user' email settings", () => {
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click({ force: true });
    cy.wait('@settingsSave').its('status').should('equal', 200);
  });

  it("should not be able to change 'user' settings if email already exists", () => {
    // add an email for admin account
    cy.clickOnLogoutItem();
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnSettingsItem();
    cy.get(emailSettingsSelector).clear().type('admin@localhost.fr');
    cy.get(submitSettingsSelector).click({ force: true });
    cy.clickOnLogoutItem();

    // try to reuse email used in admin account
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.server();
    cy.route('POST', '/api/account').as('settingsNotSave');
    cy.login('user', 'user');
    cy.clickOnSettingsItem();
    cy.get(emailSettingsSelector).clear().type('admin@localhost.fr');
    cy.get(submitSettingsSelector).click({ force: true });
    cy.wait('@settingsNotSave').its('status').should('equal', 400);
  });
});
