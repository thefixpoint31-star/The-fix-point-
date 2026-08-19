import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { REPAIR_PROBLEMS } from '../../data/mockData';
import { ProblemOption } from '../../types';
import { 
  Smartphone, BatteryCharging, Zap, PowerOff, Camera, Volume2, Wifi, 
  Droplets, Cpu, Wrench, Image as ImageIcon, Video, X, UploadCloud, 
  CheckCircle, ArrowRight, ArrowLeft, AlertCircle 
} from 'lucide-react';

interface ProblemSelectionProps {
  selectedProblemId: string;
  problemDescription: string;
  mediaFiles: string[];
  onSelectProblem: (problem: ProblemOption) => void;
  onChangeDescription: (desc: string) => void;
  onUpdateMediaFiles: (files: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProblemSelection: React.FC<ProblemSelectionProps> = ({
  selectedProblemId,
  problemDescription,
  mediaFiles,
  onSelectProblem,
  onChangeDescription,
  onUpdateMediaFiles,
  onNext,
  onBack,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getProblemIcon = (iconName: string, isSelected: boolean) => {
    const props = { className: `w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-600'}` };
    switch (iconName) {
      case 'Smartphone': return <Smartphone {...props} />;
      case 'BatteryCharging': return <BatteryCharging {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'PowerOff': return <PowerOff {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Volume2': return <Volume2 {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <Wrench {...props} />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert to mock preview URLs
    const newMediaUrls: string[] = [];
    Array.from(files).forEach((file: File) => {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError(lang === 'ar' ? 'حجم الملف أكبر من 15 ميجابايت' : 'Fichier supérieur à 15 Mo');
        return;
      }
      const url = URL.createObjectURL(file);
      newMediaUrls.push(url);
    });

    onUpdateMediaFiles([...mediaFiles, ...newMediaUrls]);
    setUploadError(null);
  };

  const handleRemoveMedia = (index: number) => {
    const updated = mediaFiles.filter((_, i) => i !== index);
    onUpdateMediaFiles(updated);
  };

  const handleAddSimulatedPhoto = () => {
    // Add sample repair photo
    const samplePhotos = [
      'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80'
    ];
    const randomPhoto = samplePhotos[mediaFiles.length % samplePhotos.length];
    onUpdateMediaFiles([...mediaFiles, randomPhoto]);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const isValid = Boolean(selectedProblemId);

  return (
    <div id="step-problem-selection" className="space-y-4 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2">
          {t('selectProblem')} <span className="text-red-500">*</span>
        </label>

        {/* 10 Problem Options Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {REPAIR_PROBLEMS.map((problem) => {
            const isSelected = selectedProblemId === problem.id;
            return (
              <button
                key={problem.id}
                type="button"
                id={`problem-card-${problem.id}`}
                onClick={() => onSelectProblem(problem)}
                className={`p-3 rounded-2xl border text-start flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    {getProblemIcon(problem.iconName, isSelected)}
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-2.5">
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                    {lang === 'ar' ? problem.nameAr : problem.nameFr}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {lang === 'ar' ? problem.descAr : problem.descFr}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Problem Description */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
        <label className="block text-xs font-bold text-slate-800">
          {t('problemDetails')}
        </label>
        <textarea
          id="problem-description-input"
          rows={3}
          value={problemDescription}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder={t('problemDetailsPlaceholder')}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Photo & Video Upload */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>{t('uploadPhotosVideos')}</span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {mediaFiles.length}/4
          </span>
        </div>

        {/* Upload Buttons */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-upload-camera-file"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('chooseFile')}</span>
          </button>

          <button
            type="button"
            id="btn-sample-photo-attach"
            onClick={handleAddSimulatedPhoto}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span>{t('takePhoto')}</span>
          </button>
        </div>

        {uploadError && (
          <p className="text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{uploadError}</span>
          </p>
        )}

        {/* Media Previews */}
        {mediaFiles.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {mediaFiles.map((url, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 group">
                <img
                  src={url}
                  alt="Repair problem preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(idx)}
                  className="absolute top-1 end-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          id="btn-back-from-problem"
          onClick={onBack}
          type="button"
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <BackArrowIcon className="w-4 h-4" />
          <span>{t('btnBack')}</span>
        </button>

        <button
          id="btn-next-from-problem"
          disabled={!isValid}
          onClick={onNext}
          type="button"
          className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-md shadow-blue-600/25 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t('btnNext')}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
