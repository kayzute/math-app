import React, { useState } from 'react';
import { PageContainer } from '../components/layout';
import { Button, ConfirmDialog } from '../components/common';
import {
  StatisticsOverview,
  OperationStatistics,
  DifficultyStatistics,
  MistakeStatistics,
  RecentSessions,
} from '../components/statistics';
import { statisticsService, mistakeService } from '../services';

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState(() => statisticsService.getStatistics());
  const [mistakeStats, setMistakeStats] = useState(() =>
    statisticsService.getMistakeStatistics(),
  );
  const [activeMistakes, setActiveMistakes] = useState(() =>
    mistakeService.getActiveMistakes(),
  );
  const [sessions, setSessions] = useState(() =>
    statisticsService.getRecentSessions(),
  );
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleReset = () => {
    statisticsService.resetStatistics();
    setStats(statisticsService.getStatistics());
    setMistakeStats(statisticsService.getMistakeStatistics());
    setActiveMistakes(mistakeService.getActiveMistakes());
    setSessions(statisticsService.getRecentSessions());
    setIsResetDialogOpen(false);
  };

  return (
    <PageContainer title="Practice Statistics">
      <div className="stats-page-container">
        <div className="stats-actions-top">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
            aria-label="Reset all statistics"
          >
            🗑️ Reset Statistics
          </Button>
        </div>

        <StatisticsOverview statistics={stats} />
        <OperationStatistics statistics={stats} />
        <DifficultyStatistics statistics={stats} />
        <MistakeStatistics
          mistakeStats={mistakeStats}
          activeMistakes={activeMistakes}
        />
        <RecentSessions sessions={sessions} />
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset Statistics?"
        message="Are you sure you want to erase all practice history and statistics? This action cannot be undone."
        confirmLabel="Erase Statistics"
        cancelLabel="Keep Statistics"
        variant="danger"
        onConfirm={handleReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </PageContainer>
  );
};

export default StatisticsPage;
