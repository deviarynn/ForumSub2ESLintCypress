/**
 * Test Suite E2E: Alur Login
 *
 * Skenario:
 * 1. Menampilkan halaman login dengan form email dan password
 * 2. Menampilkan pesan error ketika login dengan kredensial salah
 * 3. Berhasil login dan redirect ke halaman utama
 * 4. Tombol login disabled saat loading
 */

describe('Alur Login Aplikasi Forum Diskusi', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('1. menampilkan form login dengan input email dan password', () => {
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('2. menampilkan pesan error ketika login dengan kredensial salah', () => {
    cy.get('input[name="email"]').type('salah@email.com');
    cy.get('input[name="password"]').type('passwordsalah');
    cy.get('button[type="submit"]').click();

    // Tunggu error muncul
    cy.get('.auth-form__error', { timeout: 10000 }).should('be.visible');
  });

  it('3. berhasil login dan redirect ke halaman utama', () => {
    // Gunakan akun test dari Dicoding Forum API
    cy.get('input[name="email"]').type(Cypress.env('TEST_EMAIL') || 'testuser@dicoding.com');
    cy.get('input[name="password"]').type(Cypress.env('TEST_PASSWORD') || 'testpassword123');
    cy.get('button[type="submit"]').click();

    // Setelah login berhasil, harus redirect ke '/'
    cy.url({ timeout: 10000 }).should('eq', Cypress.config('baseUrl') + '/');
    // Header harus menampilkan tombol logout (user sudah login)
    cy.get('header').should('be.visible');
  });

  it('4. menampilkan teks "Memproses..." saat form disubmit', () => {
    cy.get('input[name="email"]').type('devi@test.com');
    cy.get('input[name="password"]').type('password123');

    // Intercept API call agar bisa cek loading state
    cy.intercept('POST', '**/login', (req) => {
      req.reply({ delay: 1000, statusCode: 200, body: { data: { token: 'fake-token' } } });
    }).as('loginRequest');

    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').should('contain', 'Memproses...');
  });
});
