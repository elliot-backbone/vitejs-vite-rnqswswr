import './PriorityQueue.css';

const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  high: { label: 'HIGH', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  medium: { label: 'MEDIUM', color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  low: { label: 'LOW', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
};

export default function PriorityQueue({ issues, companies, onSelectItem }) {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown';
  };

  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.urgencyScore - a.urgencyScore;
  });

  const handleAct = (issue, e) => {
    e.stopPropagation();
    console.log('Action initiated:', issue.id);
  };

  const handleWhy = (issue, e) => {
    e.stopPropagation();
    onSelectItem(issue);
  };

  if (sortedIssues.length === 0) {
    return (
      <div className="priority-queue">
        <div className="queue-header">
          <h2>Priority Queue</h2>
        </div>
        <div className="empty-state">No issues detected. All clear.</div>
      </div>
    );
  }

  return (
    <div className="priority-queue">
      <div className="queue-header">
        <h2>Priority Queue</h2>
        <div className="queue-meta">
          {issues.length} issues · {issues.filter(i => i.severity === 'critical').length} critical
        </div>
      </div>

      <div className="queue-list">
        {sortedIssues.map((issue, index) => {
          const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.medium;
          return (
            <div 
              key={issue.id} 
              className="queue-item"
              style={{ borderLeftColor: config.color }}
              onClick={() => onSelectItem(issue)}
            >
              <div className="item-rank">{index + 1}</div>
              
              <div className="item-content">
                <div className="item-header">
                  <span 
                    className="severity-badge"
                    style={{ color: config.color, backgroundColor: config.bg }}
                  >
                    {config.label}
                  </span>
                  <span className="company-name">{getCompanyName(issue.companyId)}</span>
                </div>
                
                <div className="item-title">{issue.title}</div>
                
                <div className="item-action">
                  <span className="action-arrow">→</span>
                  <span className="action-text">{issue.suggestedAction}</span>
                </div>
              </div>

              <div className="item-actions">
                <button className="action-btn primary" onClick={(e) => handleAct(issue, e)}>
                  Act
                </button>
                <button className="action-btn secondary" onClick={(e) => handleWhy(issue, e)}>
                  Why
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}