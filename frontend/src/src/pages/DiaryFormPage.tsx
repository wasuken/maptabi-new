import React from 'react';
import DiaryForm from '../components/Diary/DiaryForm';

interface DiaryFormPageProps {
  isEditing?: boolean;
}

const DiaryFormPage: React.FC<DiaryFormPageProps> = ({ isEditing = false }) => {
  return (
    <div className="diary-form-page">
      <h1>{isEditing ? '日記を編集' : '新しい日記を作成'}</h1>
      <DiaryForm isEditing={isEditing} />
    </div>
  );
};

export default DiaryFormPage;
