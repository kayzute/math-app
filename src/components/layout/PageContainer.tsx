import React from 'react';
import { Header } from './Header';
import './Layout.css';

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className="layout-root">
      <Header />
      <main className={`page-container ${className}`}>
        {title && <h1 className="page-heading">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
