
import React, { useState } from 'react';

interface SettingsModalProps {
  currentKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentKey, onSave, onClose }) => {
  const [key, setKey] = useState(currentKey);

  const handleSave = () => {
    onSave(key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 text-slate-600 p-2 rounded-lg">
              <i className="fas fa-cog"></i>
            </div>
            <h2 className="text-lg font-bold text-slate-800">API Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">YouTube Data API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your Google Cloud API Key"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              <i className="fas fa-info-circle mr-1"></i>
              Gemini API key is managed automatically by the environment.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-bold hover:text-slate-800"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
