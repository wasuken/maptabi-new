describe('基本テスト', () => {
  // ログイン状態をシミュレート
  beforeEach(() => {
    // ローカルストレージにトークンをセット
    localStorage.setItem('token', 'fake-jwt-token');

    // ユーザー情報の取得APIをモック
    cy.intercept('GET', '/api/users/me', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'test@example.com',
        displayName: 'テストユーザー',
      },
    }).as('getUserInfo');

    // 日記一覧のAPIをモック（ホームページに必要な場合）
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
    }).as('getDiaries');
  });

  it('アプリケーションにアクセスできる', () => {
    cy.visit('/');

    // 必要なAPIリクエストの完了を待機
    cy.wait('@getUserInfo');
    cy.wait('@getDiaries');

    // アプリケーションのヘッダーを確認
    cy.get('header').should('exist');
    cy.contains('マプタビ').should('be.visible');
  });

  it('ホームページの要素が表示される', () => {
    cy.visit('/');

    // 必要なAPIリクエストの完了を待機
    cy.wait('@getUserInfo');
    cy.wait('@getDiaries');

    // ホームページの要素を確認
    cy.contains('ようこそ').should('be.visible');
    cy.contains('新しい日記を作成').should('be.visible');
  });

  // ログイン不要のアクセスをテスト
  it('ログインページにアクセスできる', () => {
    // ローカルストレージをクリア（未認証状態にする）
    localStorage.removeItem('token');

    cy.visit('/login');
    cy.contains('ログイン').should('be.visible');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });
});
