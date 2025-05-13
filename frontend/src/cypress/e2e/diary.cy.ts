describe('日記機能', () => {
  beforeEach(() => {
    // 認証をモック
    localStorage.setItem('token', 'fake-jwt-token');

    // ユーザー情報のAPIリクエストをモック
    cy.intercept('GET', '/api/users/me', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'test@example.com',
        displayName: 'テストユーザー',
      },
    });

    // 日記一覧のAPIリクエストをモック
    cy.intercept('GET', '/api/diaries', {
      statusCode: 200,
      body: [
        {
          id: 1,
          userId: 1,
          title: 'テスト日記',
          content: 'これはテスト用の日記です。',
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  });

  it('ホームページにアクセスできる', () => {
    cy.visit('/');
    cy.contains('ようこそ').should('be.visible');
  });
});
