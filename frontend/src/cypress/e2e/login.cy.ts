describe('ログイン機能', () => {
  it('ログインページが表示される', () => {
    cy.visit('/login');
    cy.contains('ログイン');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('バリデーションエラーが表示される', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    // フォームのバリデーションによって送信されない
    cy.url().should('include', '/login');
  });

  // ダミーユーザーでのログインテスト
  it('ダミーユーザーでログイン', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');

    // APIレスポンスをインターセプト
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          email: 'test@example.com',
          displayName: 'テストユーザー',
        },
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');

    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // ホームページの要素が表示されるのを確認
    cy.contains('ようこそ').should('be.visible', { timeout: 10000 });
    // または特定のホームページ要素をチェック
    cy.get('.home-page').should('exist');
  });
});
