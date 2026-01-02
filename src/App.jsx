import { useState } from 'react';
import DataImport from './components/DataImport';
import PriorityQueue from './components/PriorityQueue';
import PortfolioHealthBar from './components/PortfolioHealthBar';
import { detectIssues, calculateHealth } from './lib/derivations';
import './App.css';

const VIEWS = {
  PRIORITIES: 'priorities',
  COMPANIES: 'companies',
  ROUNDS: 'rounds',
  PEOPLE: 'people',
  GOALS: 'goals',
};

export default function App() {
  const [rawData, setRawData] = useState(null);
  const [activeView, setActiveView] = useState(VIEWS.PRIORITIES);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!rawData) {
    return <DataImport onDataLoaded={setRawData} />;
  }

  const issues = detectIssues(
    rawData.companies || [],
    rawData.rounds || [],
    rawData.deals || [],
    rawData.goals || []
  );

  const companies = (rawData.companies || []).map(c => ({
    ...c,
    healthScore: calculateHealth(c, issues),
  }));

  const portfolioCompanies = companies.filter(c => c.isPortfolio);
  const portfolioHealth = portfolioCompanies.length > 0
    ? Math.round(portfolioCompanies.reduce((sum, c) => sum + c.healthScore, 0) / portfolioCompanies.length)
    : 0;
  const criticalCount = issues.filter(i => i.severity === 'critical').length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">BACKBONE</div>
        <nav className="nav">
          {Object.entries(VIEWS).map(([key, value]) => (
            <button
              key={key}
              className={`nav-btn ${activeView === value ? 'active' : ''}`}
              onClick={() => setActiveView(value)}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </nav>
        <button className="nav-btn reset-btn" onClick={() => setRawData(null)}>
          Reset Data
        </button>
      </header>

      <PortfolioHealthBar 
        health={portfolioHealth} 
        criticalCount={criticalCount}
        companyCount={portfolioCompanies.length}
      />

      <main className="main-content">
        {activeView === VIEWS.PRIORITIES && (
          <PriorityQueue 
            issues={issues}
            companies={companies}
            onSelectItem={setSelectedItem}
          />
        )}
        {activeView === VIEWS.COMPANIES && (
          <div className="placeholder">Companies view — next build</div>
        )}
        {activeView === VIEWS.ROUNDS && (
          <div className="placeholder">Rounds & Deals view — next build</div>
        )}
        {activeView === VIEWS.PEOPLE && (
          <div className="placeholder">People & Firms view — next build</div>
        )}
        {activeView === VIEWS.GOALS && (
          <div className="placeholder">Goals view — next build</div>
        )}
      </main>

      {selectedItem && (
        <aside className="detail-panel">
          <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
          <h3>Why this priority?</h3>
          <div className="detail-section">
            <div className="detail-label">Trigger</div>
            <code>{selectedItem.triggerCondition}</code>
          </div>
          <div className="detail-section">
            <div className="detail-label">Type</div>
            <span>{selectedItem.type}</span>
          </div>
          <div className="detail-section">
            <div className="detail-label">Urgency Score</div>
            <span>{selectedItem.urgencyScore}</span>
          </div>
        </aside>
      )}
    </div>
  );
}