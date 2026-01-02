import './PortfolioHealthBar.css';

export default function PortfolioHealthBar({ health, criticalCount, companyCount }) {
  const getHealthColor = (h) => {
    if (h >= 80) return '#22c55e';
    if (h >= 60) return '#eab308';
    if (h >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="health-bar-container">
      <div className="health-bar-content">
        <div className="health-section">
          <span className="health-label">PORTFOLIO HEALTH</span>
          <div className="health-track">
            <div 
              className="health-fill" 
              style={{ 
                width: `${health}%`,
                backgroundColor: getHealthColor(health)
              }}
            />
          </div>
          <span className="health-value" style={{ color: getHealthColor(health) }}>
            {health}%
          </span>
        </div>
        
        <div className="health-stats">
          <span className="stat">
            <span className="stat-value">{companyCount}</span>
            <span className="stat-label">companies</span>
          </span>
          {criticalCount > 0 && (
            <span className="stat critical">
              <span className="stat-value">{criticalCount}</span>
              <span className="stat-label">critical</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}