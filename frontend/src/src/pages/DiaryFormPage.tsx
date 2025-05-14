// src/pages/DiaryFormPage.tsx
import React from 'react';
import DiaryForm from '../components/Diary/DiaryForm';
import { useParams } from 'react-router-dom';
import { PlusCircle, Edit } from 'lucide-react';

interface DiaryFormPageProps {
  isEditing?: boolean;
}

const DiaryFormPage: React.FC<DiaryFormPageProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <div className="rounded-full bg-blue-100 p-2 mr-3">
          {isEditing ? (
            <Edit className="h-6 w-6 text-blue-600" />
          ) : (
            <PlusCircle className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? '日記を編集' : '新しい日記を作成'}
        </h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <DiaryForm isEditing={isEditing} />
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>ヒント:</strong> 位置情報を追加するには、「現在地を追加」ボタンをクリックするか、地図上の場所をクリックしてください。
          複数の位置情報を追加すると、地図上に経路として表示されます。
        </p>
      </div>
    </div>
  );
};

export default DiaryFormPage;
