import { useState } from 'react';
import './DataImport.css';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, i) => {
      let val = values[i] || '';
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(val) && val !== '') val = Number(val);
      obj[header] = val;
    });
    return obj;
  });
}

const CSV_TEMPLATES = {
  companies: `id,name,isPortfolio,stage,sector,cashOnHand,monthlyBurn,mrr,employeeCount,lastMaterialUpdate_at`,
  rounds: `id,company_id,roundType,targetAmount,raisedAmount,status,startedAt,targetCloseDate,hasLead`,
  deals: `id,round_id,firm_id,stage,checkSize,isLead,lastContactAt,nextAction,nextActionDue`,
  firms: `id,name,firmType,typicalCheckMin,typicalCheckMax`,
  people: `id,firstName,lastName,email,role,firm_id,lastContactedAt`,
  goals: `id,company_id,goalType,title,targetValue,currentValue,targetDate,status,priority`,
};

export default function DataImport({ onDataLoaded }) {
  const [tables, setTables] = useState({
    companies: '',
    rounds: '',
    deals: '',
    firms: '',
    people: '',
    goals: '',
  });
  const [activeTab, setActiveTab] = useState('companies');
  const [error, setError] = useState('');

  const updateTable = (key, value) => {
    setTables(prev => ({ ...prev, [key]: value }));
  };

  const handleLoad = () => {
    setError('');
    
    if (!tables.companies.trim()) {
      setError('Companies CSV is required');
      return;
    }

    try {
      const data = {};
      for (const [key, csv] of Object.entries(tables)) {
        data[key] = csv.trim() ? parseCSV(csv) : [];
      }
      
      if (data.companies.length === 0) {
        setError('No companies parsed');
        return;
      }
      
      onDataLoaded(data);
    } catch (e) {
      setError('Parse error: ' + e.message);
    }
  };

  const tabOrder = ['companies', 'rounds', 'deals', 'firms', 'people', 'goals'];
  const requiredTabs = ['companies'];

  return (
    <div className="import-container">
      <div className="import-box">
        <h1>BACKBONE</h1>
        <p className="import-subtitle">Import CSV data. Companies required. Others optional.</p>
        
        <div className="tab-nav">
          {tabOrder.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''} ${tables[tab].trim() ? 'has-data' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {requiredTabs.includes(tab) && <span className="required">*</span>}
              {tables[tab].trim() && <span className="check">✓</span>}
            </button>
          ))}
        </div>

        <div className="field-group">
          <div className="field-header">
            <label>{activeTab}</label>
            <span className="template-hint">
              {CSV_TEMPLATES[activeTab]}
            </span>
          </div>
          <textarea
            value={tables[activeTab]}
            onChange={(e) => updateTable(activeTab, e.target.value)}
            placeholder={`Paste ${activeTab} CSV here...\n\n${CSV_TEMPLATES[activeTab]}`}
            rows={12}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}
        
        <div className="import-actions">
          <div className="data-summary">
            {tabOrder.map(tab => tables[tab].trim() && (
              <span key={tab} className="summary-item">
                {tab}: {parseCSV(tables[tab]).length}
              </span>
            ))}
          </div>
          <button className="btn primary" onClick={handleLoad}>
            Launch Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}