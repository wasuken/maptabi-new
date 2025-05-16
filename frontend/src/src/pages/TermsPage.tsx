import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">利用規約</h1>
        <p className="mt-1 text-sm text-gray-500">最終更新日: 2025年5月15日</p>
      </div>

      <div className="p-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">1. はじめに</h2>
          <p className="text-gray-700">
            本利用規約（以下「本規約」といいます）は、マプタビ（以下「当社」といいます）が提供するウェブサービス「マプタビ」（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意いただいた上で、本サービスをご利用いただきます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">2. アカウント登録</h2>
          <p className="text-gray-700">
            2.1
            本サービスを利用するためには、当社が定める方法によりアカウント登録を行う必要があります。ユーザーは、登録情報について正確かつ最新の情報を当社に提供するものとします。
          </p>
          <p className="text-gray-700">
            2.2
            アカウント登録は、個人が自らのために利用する目的で行うものとし、以下の場合にはアカウント登録をお断りします。
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>未成年者が法定代理人の同意を得ずに登録を行う場合</li>
            <li>過去に本規約違反等により、当社が利用停止または登録抹消した者が登録を行う場合</li>
            <li>その他、当社が不適切と判断した場合</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">3. 禁止事項</h2>
          <p className="text-gray-700">
            ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪に関連する行為</li>
            <li>
              当社、ほかのユーザー、またはその他の第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為
            </li>
            <li>政治的・宗教的活動、またはそれらに関連する行為</li>
            <li>広告・宣伝・勧誘、または営業行為（当社が特に認めたものを除く）</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>不正アクセスまたは不正アクセスを試みる行為</li>
            <li>他のユーザーに成りすます行為</li>
            <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
            <li>反社会的勢力に関連する者が本サービスを利用する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">4. コンテンツの権利</h2>
          <p className="text-gray-700">
            4.1
            ユーザーが本サービスを通じて投稿、アップロードまたは作成したコンテンツ（テキスト、画像、位置情報等を含みます）の著作権は、ユーザー自身に帰属します。ただし、ユーザーは、当該コンテンツについて、当社に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用、複製、配布、派生著作物の作成、表示及び実行に関するライセンスを付与します。
          </p>
          <p className="text-gray-700">
            4.2
            ユーザーは、自ら投稿したコンテンツについて、当社または第三者の権利を侵害するものではないことを表明し保証するものとします。第三者との間で紛争が生じた場合には、ユーザーの責任と費用においてこれを解決するものとします。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">5. サービスの変更・停止・中断</h2>
          <p className="text-gray-700">
            5.1
            当社は、本サービスの内容を変更、または提供を停止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
          </p>
          <p className="text-gray-700">
            5.2
            当社は、以下の事由により、ユーザーに事前に通知することなく、一時的にサービスの全部または一部を中断・停止することがあります。
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>本サービスにかかるシステムの保守点検または更新を行う場合</li>
            <li>
              地震、落雷、火災、停電、天災やウイルスの蔓延などの不可抗力により、本サービスの提供が困難となった場合
            </li>
            <li>その他、当社が本サービスの提供が困難と判断した場合</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">6. 免責事項</h2>
          <p className="text-gray-700">
            6.1
            当社は、本サービスに関して、その安全性、正確性、確実性、有用性、特定目的への適合性、第三者の権利を侵害していないこと等について、いかなる保証も行うものではありません。
          </p>
          <p className="text-gray-700">
            6.2
            当社は、位置情報の精度について保証するものではなく、位置情報の誤差や不正確さによってユーザーに生じた損害について一切の責任を負いません。
          </p>
          <p className="text-gray-700">
            6.3
            ユーザーと他のユーザーまたは第三者との間において紛争が生じた場合、ユーザーは自己の責任と費用でこれを解決するものとし、当社はこれに一切関与せず、また一切の責任を負いません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">7. 利用規約の変更</h2>
          <p className="text-gray-700">
            当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を継続した場合、ユーザーは変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">8. 準拠法・裁判管轄</h2>
          <p className="text-gray-700">
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
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

export default TermsPage;
