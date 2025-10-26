import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, Upload } from 'lucide-react';

interface BudgetTemplate {
  id: string;
  name: string;
  allocation: Record<string, { amount: number; percentage: number; }>;
  method: 'manual' | 'automatic';
  totalBudget: number;
  createdAt: string;
  eventType?: string;
}

interface BudgetTemplateManagerProps {
  onLoadTemplate: (template: BudgetTemplate) => void;
  currentAllocation?: Record<string, { amount: number; percentage: number; }>;
  totalBudget: number;
  method: 'manual' | 'automatic';
}

const BudgetTemplateManager: React.FC<BudgetTemplateManagerProps> = ({
  onLoadTemplate,
  currentAllocation,
  totalBudget,
  method
}) => {
  const [templates, setTemplates] = useState<BudgetTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates: BudgetTemplate[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('budget-template-')) {
        try {
          const template = JSON.parse(localStorage.getItem(key) || '');
          savedTemplates.push({ ...template, id: key });
        } catch (error) {
          console.error('Error loading template:', error);
        }
      }
    }
    setTemplates(savedTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const saveTemplate = () => {
    if (!templateName.trim() || !currentAllocation) return;

    const template: BudgetTemplate = {
      id: `budget-template-${Date.now()}`,
      name: templateName.trim(),
      allocation: currentAllocation,
      method,
      totalBudget,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(template.id, JSON.stringify(template));
    setTemplates(prev => [template, ...prev]);
    setTemplateName('');
    setShowSaveDialog(false);
  };

  const deleteTemplate = (templateId: string) => {
    localStorage.removeItem(templateId);
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const exportTemplate = (template: BudgetTemplate) => {
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-')}-budget-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Budget Templates</h4>
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={!currentAllocation}
          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Save size={14} />
          Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <button
              onClick={saveTemplate}
              disabled={!templateName.trim()}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-40">
        {templates.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No saved templates yet
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                <div className="text-xs text-gray-500">
                  {template.method} • ₹{template.totalBudget.toLocaleString()} • {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onLoadTemplate(template)}
                  className="p-1 text-purple-600 hover:bg-purple-100 rounded text-xs"
                  title="Load template"
                >
                  Load
                </button>
                <button
                  onClick={() => exportTemplate(template)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="Export template"
                >
                  <Download size={12} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  title="Delete template"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetTemplateManager;