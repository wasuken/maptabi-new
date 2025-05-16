// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Github, Mail, ExternalLink, BookOpen, Globe, Lock } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">マプタビについて</h1>
      </div>

      <div className="p-6 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">サービス概要</h2>
          <p className="text-gray-700">
            「マプタビ」は、旅の思い出や日常の出来事を地図と一緒に記録できるオンライン日記サービスです。
            位置情報と文章を組み合わせることで、思い出をより鮮やかに残すことができます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">地図連携日記作成</h3>
                <p className="text-sm text-gray-600">場所の記録と一緒に日記を書くことができます</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">自動位置情報取得</h3>
                <p className="text-sm text-gray-600">現在地を自動で日記に記録できます</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">経路記録</h3>
                <p className="text-sm text-gray-600">複数の場所を巡った旅行記録も簡単に作成可能</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">公開/非公開設定</h3>
                <p className="text-sm text-gray-600">日記ごとに公開範囲を選べます</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">サービスの想い</h2>
          <p className="text-gray-700">
            「マプタビ」は、「場所」と「思い出」をつなげることで、より豊かな記録を残したいという想いから生まれました。
            旅行の記録はもちろん、日常のちょっとした発見も地図上に残すことで、新たな視点で振り返ることができます。
          </p>
          <p className="text-gray-700">
            また、公開設定を活用することで、自分だけの記録として残すだけでなく、同じ場所を訪れる人に新たな発見やインスピレーションを与えることもできます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">開発チーム</h2>
          <p className="text-gray-700">
            マプタビは、地図アプリケーションと日記サービスを融合させたいという思いを持ったエンジニアチームによって開発されました。
            ユーザーの皆様からのフィードバックを大切にしながら、継続的に機能改善を行っています。
          </p>
          <div className="flex items-center mt-4">
            <a
              href="https://github.com/wasuken/maptabi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHubリポジトリ
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">お問い合わせ</h2>
          <p className="text-gray-700">
            サービスに関するご質問やご意見は、以下のいずれかの方法でお寄せください：
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <span>メール: </span>
              <a
                href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'support@maptabi.example.com'}`}
                className="ml-1 text-blue-600 hover:underline"
              >
                {import.meta.env.VITE_SUPPORT_EMAIL || 'support@maptabi.example.com'}
              </a>
            </li>
            <li className="flex items-center text-gray-700">
              <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
              <span>お問い合わせフォーム: </span>
              <a
                href={
                  import.meta.env.VITE_CONTACT_FORM_URL || 'https://maptabi.example.com/contact'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 hover:underline"
              >
                こちらから
              </a>
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            皆様のご意見をもとに、より使いやすく価値あるサービスを目指して改善を続けてまいります。
          </p>
        </section>

        <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ホームに戻る
          </Link>
          <div className="space-x-4">
            <Link
              to="/terms"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              利用規約
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
