import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { LessonPlanState, GradeLevel, AIResponseState } from './types';
import { integrateAIContent } from './services/geminiService';

const App: React.FC = () => {
  const [lessonState, setLessonState] = useState<LessonPlanState>({
    originalContent: '',
    images: [], // Initialize images array
    grade: GradeLevel.GRADE_10,
    subject: '',
  });

  const [aiState, setAiState] = useState<AIResponseState>({
    markdown: '',
    isLoading: false,
    error: null,
  });

  const handleGenerate = async () => {
    if (!lessonState.originalContent.trim()) return;

    setAiState({ markdown: '', isLoading: true, error: null });

    try {
      await integrateAIContent(
        lessonState.originalContent,
        lessonState.grade,
        lessonState.subject || 'Môn học chung',
        lessonState.images, // Pass extracted images to AI
        (chunk) => {
           setAiState(prev => ({ ...prev, markdown: chunk }));
        }
      );
    } catch (error: any) {
      setAiState(prev => ({
        ...prev,
        error: error.message || 'Đã xảy ra lỗi không xác định khi kết nối AI.',
      }));
    } finally {
      setAiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-9rem)]">
          {/* Left Column: Input */}
          <div className="h-full">
            <InputSection 
              state={lessonState} 
              setState={setLessonState} 
              onSubmit={handleGenerate}
              isGenerating={aiState.isLoading}
            />
          </div>

          {/* Right Column: Output */}
          <div className="h-full">
            <OutputSection 
              markdown={aiState.markdown}
              error={aiState.error}
              isLoading={aiState.isLoading}
              images={lessonState.images}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;