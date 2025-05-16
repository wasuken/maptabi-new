import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Database, MapPin } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
        <p className="mt-1 text-sm text-gray-500">最終更新日: 2025年5月15日</p>
      </div>

      <div className="p-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">1. はじめに</h2>
          <p className="text-gray-700">
            マプタビ（以下「当社」といいます）は、提供するサービス「マプタビ」（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. 収集する情報</h2>
          <p className="text-gray-700">当社は、以下の情報を取得し、利用します。</p>

          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">アカウント情報</h3>
                <p className="text-sm text-gray-600">
                  氏名、メールアドレス、パスワード等の登録情報
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">位置情報</h3>
                <p className="text-sm text-gray-600">
                  日記に関連付けられた位置情報（緯度・経度）、現在地情報
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">利用情報</h3>
                <p className="text-sm text-gray-600">
                  本サービスの利用履歴、アクセスログ、Cookie情報、IPアドレス等
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">3. 情報の利用目的</h2>
          <p className="text-gray-700">当社は、取得した情報を以下の目的のために利用します。</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザーの認証、アカウント管理</li>
            <li>位置情報を利用した日記機能の提供</li>
            <li>地図上での日記の表示・共有</li>
            <li>お問い合わせへの対応</li>
            <li>利用規約違反の調査・対応</li>
            <li>サービスの利用状況の分析・統計</li>
            <li>新機能・更新情報のお知らせ</li>
            <li>当社からのお知らせやメールマガジンの配信</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">4. 位置情報の取り扱い</h2>
          <p className="text-gray-700">
            4.1
            本サービスでは、位置情報を取得・利用します。位置情報は、ユーザーが明示的に許可した場合にのみ取得されます。
          </p>
          <p className="text-gray-700">
            4.2
            記録された位置情報は、ユーザーが設定した公開範囲に応じて、他のユーザーに公開される場合があります。
          </p>
          <p className="text-gray-700">
            4.3 位置情報の精度レベルは、ユーザーのデバイスや設定によって異なります。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">5. 第三者への情報提供</h2>
          <p className="text-gray-700">
            当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
            <li>
              国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合
            </li>
            <li>統計的なデータとして、ユーザーを識別できない形で提供する場合</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">6. セキュリティ対策</h2>
          <p className="text-gray-700">
            当社は、個人情報の漏洩、滅失またはき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。個人情報の取扱いの全部または一部を委託する場合は、委託先との間で秘密保持契約を締結する等、委託先においても個人情報の安全管理が図られるよう、必要かつ適切な監督を行います。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">7. ユーザーの権利</h2>
          <p className="text-gray-700">
            ユーザーは、当社に対して個人情報の開示、訂正、追加、削除、利用停止または消去を請求することができます。これらの請求を行う場合は、当社が別途定める方法に従って手続きを行ってください。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">8. Cookieの使用について</h2>
          <p className="text-gray-700">
            当社のサービスでは、ユーザー体験の向上やサービスの改善のため、Cookieを使用しています。ユーザーは、ブラウザの設定からCookieの受け入れを拒否することができますが、その場合、本サービスの一部の機能が利用できなくなる可能性があります。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">9. プライバシーポリシーの変更</h2>
          <p className="text-gray-700">
            当社は、法令変更への対応や本サービスの変更等の事情により、本ポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に変更後のプライバシーポリシーを掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">10. お問い合わせ窓口</h2>
          <p className="text-gray-700">
            本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
          </p>
          <div className="mt-2 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              メールアドレス: {import.meta.env.VITE_PRIVACY_EMAIL || 'privacy@maptabi.example.com'}
            </p>
            <p className="text-gray-700">
              運営: {import.meta.env.VITE_MANAGEMENT || 'マプタビ委員会'}
            </p>
          </div>
        </section>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <Link
            to="/about"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
