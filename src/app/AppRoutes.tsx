import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  HomePage,
  PracticeSetupPage,
  PracticePage,
  SessionSummaryPage,
  StatisticsPage,
  SettingsPage,
  NotFoundPage,
} from '../pages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice/setup" element={<PracticeSetupPage />} />
      <Route path="/practice/session" element={<PracticePage />} />
      <Route path="/practice/summary" element={<SessionSummaryPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
