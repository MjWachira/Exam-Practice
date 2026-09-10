import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Download, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadExcelQuestionBank } from '../services/api';

export default function ExcelUploaderModal({ isOpen, onClose, onRefreshQuestions }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel (.xlsx or .xls) file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadExcelQuestionBank(formData);
      setMessage(res.data.message);
      setFile(null);
      if (onRefreshQuestions) onRefreshQuestions();
    } catch (err) {
      console.error('Excel upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload Excel file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    window.open('/api/exam/excel-template', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Excel Question Bank Manager</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Load or swap CSM questions directly from Excel spreadsheets</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-violet-700 dark:text-violet-300 mb-1">📋 Supported Excel Format (.xlsx):</p>
          <p>Spreadsheets must contain columns for <span className="text-slate-900 dark:text-slate-100 font-mono">ID, Question, Option A, Option B, Option C, Option D, Correct Answer, Explanation, Domain</span>.</p>
        </div>

        {/* Download Template Option */}
        <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Need a starting template?</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Download the pre-formatted CSM sample Excel file</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .xlsx</span>
          </button>
        </div>

        {/* Form Upload */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl p-6 text-center hover:border-violet-500/50 transition-colors bg-slate-50 dark:bg-slate-900/40">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              id="excel-file-input"
              className="hidden"
            />
            <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-2 animate-bounce" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {file ? file.name : 'Click to select Excel file (.xlsx)'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Or drag and drop your file here'}
              </span>
            </label>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Upload CTA */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              loading || !file
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'gradient-btn'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing Excel Sheet...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload & Load Questions</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
