import React, { useState } from 'react';

const BonusCalculator = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [employees, setEmployees] = useState([
    { name: 'Jamie', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 117336.01, rolePerf: 0 },
    { name: 'Johnny', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 48870.04, rolePerf: 0 },
    { name: 'Neil', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 51043.90, rolePerf: 0 },
    { name: 'Chris', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 27569.05, rolePerf: 0 },
    { name: 'Shelley', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 16924.21, rolePerf: 0 },
    { name: 'Sheena', sales: true, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 2163.73, rolePerf: 0 },
    { name: 'Nich', sales: false, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 0, rolePerf: 0 },
    { name: 'Aaron', sales: false, scores: [0,0,0,0,0,0,0,0,0,0], avgMonthlySales: 0, rolePerf: 0 }
  ]);

  const categories = [
    { name: 'Months Worked', weight: 0.15 },
    { name: 'Work Ethic', weight: 0.15 },
    { name: 'Initiative', weight: 0.10 },
    { name: 'Teamwork', weight: 0.10 },
    { name: 'Above & Beyond', weight: 0.10 },
    { name: 'Organization', weight: 0.10 },
    { name: 'Cleanup', weight: 0.05 },
    { name: 'No Repetition', weight: 0.10 },
    { name: 'Professionalism', weight: 0.10 },
    { name: 'Time Served', weight: 0.05 }
  ];

  const roleWeight = 0.05;

  const getSalesScore = (sales) => {
    if (sales < 30000) return 1;
    if (sales < 50000) return 2;
    if (sales < 80000) return 3;
    if (sales < 110000) return 4;
    return 5;
  };

  const calculateFinalScore = (emp) => {
    let score = 0;
    emp.scores.forEach((s, i) => {
      score += s * categories[i].weight;
    });
    if (emp.sales) {
      score += getSalesScore(emp.avgMonthlySales) * roleWeight;
    } else {
      score += emp.rolePerf * roleWeight;
    }
    return score;
  };

  const updateScore = (empIndex, scoreIndex, value) => {
    const newEmployees = [...employees];
    newEmployees[empIndex].scores[scoreIndex] = parseInt(value);
    setEmployees(newEmployees);
  };

  const updateSales = (empIndex, value) => {
    const newEmployees = [...employees];
    newEmployees[empIndex].avgMonthlySales = parseFloat(value) || 0;
    setEmployees(newEmployees);
  };

  const updateRolePerf = (empIndex, value) => {
    const newEmployees = [...employees];
    newEmployees[empIndex].rolePerf = parseInt(value);
    setEmployees(newEmployees);
  };

  const results = employees.map(emp => ({
    ...emp,
    salesScore: emp.sales ? getSalesScore(emp.avgMonthlySales) : 0,
    finalScore: calculateFinalScore(emp)
  }));

  const totalScore = results.reduce((sum, emp) => sum + emp.finalScore, 0);
  const resultsWithBonus = results.map(emp => ({
    ...emp,
    bonusPercent: totalScore > 0 ? (emp.finalScore / totalScore) * 100 : 0
  }));

  const exportCSV = () => {
    let csv = 'Employee,Sales,Months Worked,Work Ethic,Initiative,Teamwork,Above & Beyond,Organization,Cleanup,No Repetition,Professionalism,Time Served,Avg Monthly Sales,Sales Score,Role Perf,Final Score,Bonus %\n';
    resultsWithBonus.forEach(emp => {
      csv += `${emp.name},${emp.sales ? 'Y' : 'N'},${emp.scores.join(',')},${emp.avgMonthlySales},${emp.salesScore},${emp.sales ? 'N/A' : emp.rolePerf},${emp.finalScore.toFixed(2)},${emp.bonusPercent.toFixed(2)}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bonus_Calculator_Results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveData = () => {
    const data = JSON.stringify(employees, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bonus_calculator_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setEmployees(data);
        } catch (error) {
          alert('Error loading file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom right, rgb(248 250 252), rgb(226 232 240))',padding:'16px'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',background:'white',borderRadius:'12px',boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)',overflow:'hidden'}}>
        <div style={{background:'linear-gradient(to right, rgb(37 99 235), rgb(29 78 216))',color:'white',padding:'32px'}}>
          <h1 style={{fontSize:'36px',fontWeight:'bold'}}>Workplace Bonus Calculator</h1>
          <p style={{color:'rgb(191 219 254)',marginTop:'8px'}}>July 2024 - June 2025</p>
        </div>

        <div style={{display:'flex',borderBottom:'1px solid rgb(229 231 235)'}}>
          {['calculator', 'instructions', 'definitions', 'results'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding:'16px 24px',
                fontWeight:'600',
                border:'none',
                background:'none',
                cursor:'pointer',
                color: activeTab === tab ? 'rgb(37 99 235)' : 'rgb(107 114 128)',
                borderBottom: activeTab === tab ? '4px solid rgb(37 99 235)' : '4px solid transparent',
                transition:'all 0.2s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={{padding:'32px'}}>
          {activeTab === 'calculator' && (
            <div>
              <div style={{display:'flex',gap:'12px',marginBottom:'24px',flexWrap:'wrap'}}>
                <button onClick={saveData} style={{padding:'8px 24px',background:'rgb(5 150 105)',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}}>
                  Save Progress
                </button>
                <label style={{padding:'8px 24px',background:'rgb(37 99 235)',color:'white',borderRadius:'8px',fontWeight:'600',cursor:'pointer',display:'inline-block'}}>
                  Load Data
                  <input type="file" accept=".json" onChange={loadData} style={{display:'none'}} />
                </label>
                <button onClick={exportCSV} style={{padding:'8px 24px',background:'rgb(147 51 234)',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}}>
                  Export CSV
                </button>
              </div>

              {employees.map((emp, empIndex) => (
                <div key={empIndex} style={{background:'rgb(249 250 251)',padding:'24px',marginBottom:'24px',borderRadius:'8px',border:'1px solid rgb(229 231 235)'}}>
                  <h3 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'16px'}}>
                    {emp.name} <span style={{fontWeight:'normal',fontSize:'14px',color:'rgb(107 114 128)'}}>({emp.sales ? 'Sales' : 'Non-Sales'})</span>
                  </h3>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'16px',marginBottom:'16px'}}>
                    {categories.map((cat, catIndex) => (
                      <div key={catIndex}>
                        <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>{cat.name}</label>
                        <select
                          value={emp.scores[catIndex]}
                          onChange={(e) => updateScore(empIndex, catIndex, e.target.value)}
                          style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px'}}
                        >
                          {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px',marginTop:'16px',paddingTop:'16px',borderTop:'2px solid rgb(229 231 235)'}}>
                    {emp.sales ? (
                      <>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Avg Monthly Sales ($)</label>
                          <input
                            type="number"
                            value={emp.avgMonthlySales}
                            onChange={(e) => updateSales(empIndex, e.target.value)}
                            style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px'}}
                          />
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Sales Score (Auto)</label>
                          <input type="text" value={getSalesScore(emp.avgMonthlySales)} disabled style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px',background:'rgb(243 244 246)'}} />
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'rgb(156 163 175)'}}>Role Perf</label>
                          <input type="text" value="N/A" disabled style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px',background:'rgb(243 244 246)',color:'rgb(156 163 175)'}} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Role Performance (0-5)</label>
                          <select
                            value={emp.rolePerf}
                            onChange={(e) => updateRolePerf(empIndex, e.target.value)}
                            style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px'}}
                          >
                            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'rgb(156 163 175)'}}>Avg Sales</label>
                          <input type="text" value="N/A" disabled style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px',background:'rgb(243 244 246)',color:'rgb(156 163 175)'}} />
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'rgb(156 163 175)'}}>Sales Score</label>
                          <input type="text" value="N/A" disabled style={{width:'100%',padding:'10px',border:'1px solid rgb(209 213 219)',borderRadius:'6px',background:'rgb(243 244 246)',color:'rgb(156 163 175)'}} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h2 style={{fontSize:'24px',fontWeight:'bold',marginBottom:'16px'}}>How to Use</h2>
              <div style={{background:'rgb(239 246 255)',borderLeft:'4px solid rgb(59 130 246)',padding:'16px',marginBottom:'24px'}}>
                <p style={{fontWeight:'600',color:'rgb(30 64 175)'}}>This calculator works right in your browser!</p>
              </div>
              <ol style={{marginLeft:'20px',lineHeight:'1.8',fontSize:'18px'}}>
                <li>Score each employee 0-5 on all 10 categories</li>
                <li>Sales staff: Monthly sales are pre-filled, scores auto-calculate</li>
                <li>Non-sales staff: Enter Role Performance score (0-5)</li>
                <li>Check Results tab to see bonus percentages</li>
                <li>Click Export CSV to download results</li>
              </ol>
              <div style={{background:'rgb(254 243 199)',borderLeft:'4px solid rgb(245 158 11)',padding:'16px',marginTop:'24px'}}>
                <h3 style={{fontWeight:'bold',marginBottom:'8px'}}>Sales Score Thresholds:</h3>
                <ul style={{marginLeft:'20px',marginTop:'8px'}}>
                  <li>Under $30,000/month = Score 1</li>
                  <li>$30,000-$49,999/month = Score 2</li>
                  <li>$50,000-$79,999/month = Score 3</li>
                  <li>$80,000-$109,999/month = Score 4</li>
                  <li>$110,000+/month = Score 5</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'definitions' && (
            <div>
              <h2 style={{fontSize:'24px',fontWeight:'bold',marginBottom:'24px'}}>Category Definitions</h2>
              {[
                ['MONTHS WORKED', 'How many months you were here during the bonus period (July 2024–June 2025).'],
                ['WORK ETHIC', 'Do you show up ready to work? Do you keep a steady pace?'],
                ['INITIATIVE', 'Do you take action without waiting to be told?'],
                ['TEAMWORK', 'Do you help people out when they need it? Are you easy to work with?'],
                ['ABOVE & BEYOND', 'Doing more than just the bare minimum when the situation calls for it.'],
                ['ORGANIZATION', 'Keeping your area, parts, tools, papers, and general workspace in order.'],
                ['CLEANUP', 'Not leaving messes or garbage for others. Cleaning up after a job.'],
                ['NO REPETITION', 'Can you take instructions, remember them, and follow through the first time?'],
                ['PROFESSIONALISM', 'Being respectful, reliable, and not causing problems for others.'],
                ['TIME SERVED', 'How long you have been with the company overall. Years matter.'],
                ['ROLE PERFORMANCE', 'Sales: Auto-calculated. Non-sales: Job performance.']
              ].map(([title, desc], i) => (
                <div key={i} style={{background:'rgb(239 246 255)',borderLeft:'4px solid rgb(59 130 246)',padding:'16px',marginBottom:'16px',borderRadius:'4px'}}>
                  <h4 style={{fontWeight:'bold',fontSize:'16px',marginBottom:'8px'}}>{title}</h4>
                  <p style={{color:'rgb(55 65 81)'}}>{desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h2 style={{fontSize:'24px',fontWeight:'bold',marginBottom:'24px'}}>Results Summary</h2>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'rgb(37 99 235)',color:'white'}}>
                      <th style={{padding:'12px',textAlign:'left'}}>Employee</th>
                      <th style={{padding:'12px',textAlign:'left'}}>Type</th>
                      <th style={{padding:'12px',textAlign:'center'}}>Sales Score</th>
                      <th style={{padding:'12px',textAlign:'center'}}>Role Perf</th>
                      <th style={{padding:'12px',textAlign:'center'}}>Final Score</th>
                      <th style={{padding:'12px',textAlign:'center'}}>Bonus %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsWithBonus.map((emp, i) => (
                      <tr key={i} style={{background: i % 2 === 0 ? 'rgb(249 250 251)' : 'white'}}>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)'}}><strong>{emp.name}</strong></td>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)'}}>{emp.sales ? 'Sales' : 'Non-Sales'}</td>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)',textAlign:'center'}}>{emp.sales ? emp.salesScore : 'N/A'}</td>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)',textAlign:'center'}}>{emp.sales ? 'N/A' : emp.rolePerf}</td>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)',textAlign:'center'}}><strong>{emp.finalScore.toFixed(2)}</strong></td>
                        <td style={{padding:'12px',borderBottom:'1px solid rgb(229 231 235)',textAlign:'center'}}><strong style={{color:'rgb(37 99 235)'}}>{emp.bonusPercent.toFixed(2)}%</strong></td>
                      </tr>
                    ))}
                    <tr style={{background:'rgb(219 234 254)',fontWeight:'bold'}}>
                      <td colSpan="4" style={{padding:'12px'}}>TOTAL</td>
                      <td style={{padding:'12px',textAlign:'center'}}>{totalScore.toFixed(2)}</td>
                      <td style={{padding:'12px',textAlign:'center'}}>100.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusCalculator;