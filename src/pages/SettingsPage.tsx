import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button, ConfirmDialog } from '../components/common';
import { storageService } from '../services';
import type {
  AppSettings,
  MathOperation,
  DifficultyLevel,
  SessionLength,
} from '../types';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(() =>
    storageService.getSettings(),
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    storageService.saveSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleOperation = (op: MathOperation) => {
    const current = settings.defaultOperations;
    let next: MathOperation[];
    if (current.includes(op)) {
      if (current.length === 1) return; // keep at least one
      next = current.filter((o) => o !== op);
    } else {
      next = [...current, op];
    }
    updateSetting('defaultOperations', next);
  };

  const handleClearAllData = () => {
    storageService.clearAllData();
    setIsClearDialogOpen(false);
    navigate('/');
  };

  return (
    <PageContainer title="Application Settings">
      <div className="settings-container">
        {isSaved && (
          <div className="settings-saved-banner" role="status">
            ✓ Settings saved automatically!
          </div>
        )}

        <section className="settings-section">
          <h2>Display & Feedback Preferences</h2>

          <div className="setting-row">
            <div className="setting-info">
              <label htmlFor="sound-toggle" className="setting-title">
                Sound Effects
              </label>
              <p className="setting-desc">
                Play gentle audio feedback on card actions
              </p>
            </div>
            <input
              id="sound-toggle"
              type="checkbox"
              className="toggle-switch"
              checked={settings.soundEnabled}
              onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
            />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label htmlFor="anim-toggle" className="setting-title">
                Card Flip Animation
              </label>
              <p className="setting-desc">Smooth 3D card-flip rotation</p>
            </div>
            <input
              id="anim-toggle"
              type="checkbox"
              className="toggle-switch"
              checked={settings.cardAnimationEnabled}
              onChange={(e) =>
                updateSetting('cardAnimationEnabled', e.target.checked)
              }
            />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label htmlFor="exp-toggle" className="setting-title">
                Show Explanations
              </label>
              <p className="setting-desc">
                Display hints and explanations after answering
              </p>
            </div>
            <input
              id="exp-toggle"
              type="checkbox"
              className="toggle-switch"
              checked={settings.showExplanations}
              onChange={(e) =>
                updateSetting('showExplanations', e.target.checked)
              }
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Default Practice Defaults</h2>

          <div className="setting-block">
            <label className="setting-title">Default Operations</label>
            <div className="default-ops-grid">
              {(
                [
                  { id: 'addition', label: 'Addition (+)' },
                  { id: 'subtraction', label: 'Subtraction (−)' },
                  { id: 'multiplication', label: 'Multiplication (×)' },
                  { id: 'division', label: 'Division (÷)' },
                ] as const
              ).map(({ id, label }) => {
                const isSelected = settings.defaultOperations.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`default-op-pill ${
                      isSelected ? 'default-op-pill--active' : ''
                    }`}
                    onClick={() => toggleOperation(id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="setting-block">
            <label htmlFor="default-diff-select" className="setting-title">
              Default Difficulty
            </label>
            <select
              id="default-diff-select"
              className="setting-select"
              value={settings.defaultDifficulty}
              onChange={(e) =>
                updateSetting(
                  'defaultDifficulty',
                  Number(e.target.value) as DifficultyLevel,
                )
              }
            >
              <option value={1}>Level 1: Beginner</option>
              <option value={2}>Level 2: Easy</option>
              <option value={3}>Level 3: Intermediate</option>
              <option value={4}>Level 4: Advanced</option>
            </select>
          </div>

          <div className="setting-block">
            <label htmlFor="default-len-select" className="setting-title">
              Default Session Length
            </label>
            <select
              id="default-len-select"
              className="setting-select"
              value={String(settings.defaultSessionLength)}
              onChange={(e) => {
                const val = e.target.value;
                const parsed: SessionLength =
                  val === 'continuous' ? 'continuous' : Number(val);
                updateSetting('defaultSessionLength', parsed);
              }}
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="20">20 Questions</option>
              <option value="continuous">Continuous Practice</option>
            </select>
          </div>

          <div className="setting-block">
            <label htmlFor="mastery-threshold" className="setting-title">
              Mistake Mastery Threshold
            </label>
            <p className="setting-desc">
              Number of correct review answers required to mark a mistake as
              mastered
            </p>
            <input
              id="mastery-threshold"
              type="number"
              min={1}
              max={10}
              className="setting-number-input"
              value={settings.masteryThreshold}
              onChange={(e) =>
                updateSetting(
                  'masteryThreshold',
                  Math.max(1, Math.min(10, Number(e.target.value) || 3)),
                )
              }
            />
          </div>
        </section>

        <section className="settings-section settings-section--danger">
          <h2>Data Management</h2>
          <p className="setting-desc">
            All your math progress is stored safely in your browser. If you want
            to start fresh, you can reset all application data.
          </p>
          <Button
            variant="danger"
            size="md"
            onClick={() => setIsClearDialogOpen(true)}
          >
            ⚠️ Clear All Application Data
          </Button>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        title="Clear All Application Data?"
        message="This will completely erase all practice history, statistics, settings, and recorded mistakes. This action cannot be undone."
        confirmLabel="Erase Everything"
        cancelLabel="Keep Data"
        variant="danger"
        onConfirm={handleClearAllData}
        onCancel={() => setIsClearDialogOpen(false)}
      />
    </PageContainer>
  );
};

export default SettingsPage;
