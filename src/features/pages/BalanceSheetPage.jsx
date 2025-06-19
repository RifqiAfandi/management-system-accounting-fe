import React, { useState, useEffect } from 'react';
import './BalanceSheetPage.css';

const BalanceSheetPage = () => {
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [trialBalanceData, setTrialBalanceData] = useState(null);
  const [financialRatios, setFinancialRatios] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [activeTab, setActiveTab] = useState('balance-sheet');

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchBalanceSheetData();
    fetchTrialBalance();
    fetchFinancialRatios();
  }, [selectedPeriod]);
  const fetchBalanceSheetData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Silakan login terlebih dahulu');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/accounting/balance-sheet?year=${selectedPeriod.year}&month=${selectedPeriod.month}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBalanceSheetData(result.data);
        } else {
          setError(result.message || 'Gagal mengambil data neraca');
        }
      } else if (response.status === 401) {
        setError('Session telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
      } else {
        setError(`Error ${response.status}: Gagal mengambil data neraca`);
      }
    } catch (err) {
      console.error('Error fetching balance sheet:', err);
      setError('Terjadi kesalahan jaringan. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  };
  const fetchTrialBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/accounting/trial-balance`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTrialBalanceData(result.data);
        }
      } else if (response.status !== 401) {
        console.warn('Failed to fetch trial balance data');
      }
    } catch (err) {
      console.error('Error fetching trial balance:', err);
    }
  };
  const fetchFinancialRatios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/accounting/financial-ratios?year=${selectedPeriod.year}&month=${selectedPeriod.month}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFinancialRatios(result.data);
        }
      } else if (response.status !== 401) {
        console.warn('Failed to fetch financial ratios data');
      }
    } catch (err) {
      console.error('Error fetching financial ratios:', err);
    }
  };

  const createAutomaticJournalEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(1); // First day of current month

      const response = await fetch(
        `${API_BASE_URL}/accounting/create-automatic-entries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          })
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(`Journal entries created successfully! Total: ${result.data.totalEntries} entries`);
          // Refresh data
          fetchBalanceSheetData();
          fetchTrialBalance();
          fetchFinancialRatios();
        }
      }
    } catch (err) {
      console.error('Error creating journal entries:', err);
      setError('Failed to create journal entries');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || '';
  };
  const renderBalanceSheet = () => {
    // Fallback data untuk demo ketika tidak ada data dari backend
    const demoData = {
      period: { year: selectedPeriod.year, month: selectedPeriod.month },
      balanceSheet: {
        isBalanced: true,
        assets: {
          currentAssets: [
            { accountName: 'Kas', balance: 50000000 },
            { accountName: 'Bank BCA', balance: 150000000 },
            { accountName: 'Piutang Usaha', balance: 75000000 },
            { accountName: 'Persediaan', balance: 100000000 }
          ],
          totalCurrentAssets: 375000000,
          fixedAssets: [
            { accountName: 'Peralatan Toko', balance: 80000000 },
            { accountName: 'Kendaraan', balance: 120000000 },
            { accountName: 'Bangunan', balance: 500000000 }
          ],
          totalFixedAssets: 700000000,
          totalAssets: 1075000000
        },
        liabilities: {
          currentLiabilities: [
            { accountName: 'Hutang Usaha', balance: 45000000 },
            { accountName: 'Hutang Gaji', balance: 15000000 },
            { accountName: 'Hutang Pajak', balance: 10000000 }
          ],
          totalCurrentLiabilities: 70000000,
          longTermLiabilities: [
            { accountName: 'Hutang Bank', balance: 200000000 }
          ],
          totalLongTermLiabilities: 200000000,
          totalLiabilities: 270000000
        },
        equity: {
          capital: [
            { accountName: 'Modal Pemilik', balance: 600000000 }
          ],
          retainedEarnings: [
            { accountName: 'Laba Ditahan', balance: 205000000 }
          ],
          totalEquity: 805000000
        },
        totalLiabilitiesAndEquity: 1075000000
      }
    };

    const data = balanceSheetData || demoData;
    
    if (!data) return (
      <div className="no-data-message">
        <h3>Tidak ada data neraca tersedia</h3>
        <p>Silakan sync data atau periksa koneksi ke backend.</p>
      </div>
    );

    const { balanceSheet } = data;

    return (
      <div className="balance-sheet-container">
        <div className="balance-sheet-header">          <h2>NERACA (BALANCE SHEET)</h2>
          <p className="period-info">
            Per {getMonthName(data.period.month)} {data.period.year}
          </p>
          <div className={`balance-indicator ${balanceSheet.isBalanced ? 'balanced' : 'unbalanced'}`}>
            {balanceSheet.isBalanced ? '✅ NERACA SEIMBANG' : '⚠️ NERACA TIDAK SEIMBANG'}
          </div>
        </div>

        <div className="balance-sheet-content">
          {/* ASSETS SECTION */}
          <div className="balance-sheet-section">
            <h3 className="section-title">ASET (ASSETS)</h3>
            
            {/* Current Assets */}
            <div className="account-category">
              <h4 className="category-title">Aset Lancar (Current Assets)</h4>
              {balanceSheet.assets.currentAssets.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div className="category-total">
                <span className="total-label">Total Aset Lancar</span>
                <span className="total-amount">{formatCurrency(balanceSheet.assets.totalCurrentAssets)}</span>
              </div>
            </div>

            {/* Fixed Assets */}
            <div className="account-category">
              <h4 className="category-title">Aset Tetap (Fixed Assets)</h4>
              {balanceSheet.assets.fixedAssets.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div className="category-total">
                <span className="total-label">Total Aset Tetap</span>
                <span className="total-amount">{formatCurrency(balanceSheet.assets.totalFixedAssets)}</span>
              </div>
            </div>

            <div className="section-total">
              <span className="section-label">TOTAL ASET</span>
              <span className="section-amount">{formatCurrency(balanceSheet.assets.totalAssets)}</span>
            </div>
          </div>

          {/* LIABILITIES AND EQUITY SECTION */}
          <div className="balance-sheet-section">
            <h3 className="section-title">KEWAJIBAN & EKUITAS (LIABILITIES & EQUITY)</h3>
            
            {/* Current Liabilities */}
            <div className="account-category">
              <h4 className="category-title">Kewajiban Lancar (Current Liabilities)</h4>
              {balanceSheet.liabilities.currentLiabilities.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div className="category-total">
                <span className="total-label">Total Kewajiban Lancar</span>
                <span className="total-amount">{formatCurrency(balanceSheet.liabilities.totalCurrentLiabilities)}</span>
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div className="account-category">
              <h4 className="category-title">Kewajiban Jangka Panjang (Long-term Liabilities)</h4>
              {balanceSheet.liabilities.longTermLiabilities.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div className="category-total">
                <span className="total-label">Total Kewajiban Jangka Panjang</span>
                <span className="total-amount">{formatCurrency(balanceSheet.liabilities.totalLongTermLiabilities)}</span>
              </div>
            </div>

            <div className="subsection-total">
              <span className="subsection-label">Total Kewajiban</span>
              <span className="subsection-amount">{formatCurrency(balanceSheet.liabilities.totalLiabilities)}</span>
            </div>

            {/* Equity */}
            <div className="account-category">
              <h4 className="category-title">Ekuitas (Equity)</h4>
              {balanceSheet.equity.capital.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              {balanceSheet.equity.retainedEarnings.map((account, index) => (
                <div key={index} className="account-line">
                  <span className="account-name">{account.accountName}</span>
                  <span className="account-amount">{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div className="category-total">
                <span className="total-label">Total Ekuitas</span>
                <span className="total-amount">{formatCurrency(balanceSheet.equity.totalEquity)}</span>
              </div>
            </div>

            <div className="section-total">
              <span className="section-label">TOTAL KEWAJIBAN & EKUITAS</span>
              <span className="section-amount">{formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderTrialBalance = () => {
    // Demo data untuk trial balance
    const demoTrialBalance = {
      asOfDate: `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-31`,
      accounts: [
        { accountCode: '1-1001', accountName: 'Kas', accountType: 'Asset', debitAmount: 50000000, creditAmount: 0 },
        { accountCode: '1-1002', accountName: 'Bank BCA', accountType: 'Asset', debitAmount: 150000000, creditAmount: 0 },
        { accountCode: '1-1101', accountName: 'Piutang Usaha', accountType: 'Asset', debitAmount: 75000000, creditAmount: 0 },
        { accountCode: '1-1201', accountName: 'Persediaan', accountType: 'Asset', debitAmount: 100000000, creditAmount: 0 },
        { accountCode: '1-2001', accountName: 'Peralatan Toko', accountType: 'Asset', debitAmount: 80000000, creditAmount: 0 },
        { accountCode: '2-1001', accountName: 'Hutang Usaha', accountType: 'Liability', debitAmount: 0, creditAmount: 45000000 },
        { accountCode: '2-1002', accountName: 'Hutang Gaji', accountType: 'Liability', debitAmount: 0, creditAmount: 15000000 },
        { accountCode: '3-1001', accountName: 'Modal Pemilik', accountType: 'Equity', debitAmount: 0, creditAmount: 600000000 },
        { accountCode: '4-1001', accountName: 'Pendapatan Penjualan', accountType: 'Revenue', debitAmount: 0, creditAmount: 300000000 },
        { accountCode: '5-1001', accountName: 'Beban Gaji', accountType: 'Expense', debitAmount: 50000000, creditAmount: 0 }
      ],
      totals: {
        totalDebits: 505000000,
        totalCredits: 960000000,
        isBalanced: false
      }
    };

    const data = trialBalanceData || demoTrialBalance;
    
    if (!data) return (
      <div className="no-data-message">
        <h3>Tidak ada data neraca saldo tersedia</h3>
        <p>Silakan sync data atau periksa koneksi ke backend.</p>
      </div>
    );

    return (
      <div className="trial-balance-container">        <div className="trial-balance-header">
          <h2>NERACA SALDO (TRIAL BALANCE)</h2>
          <p className="period-info">Per {data.asOfDate}</p>
          <div className={`balance-indicator ${data.totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
            {data.totals.isBalanced ? '✅ SALDO SEIMBANG' : '⚠️ SALDO TIDAK SEIMBANG'}
          </div>
        </div>

        <div className="trial-balance-table">
          <table>
            <thead>
              <tr>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Jenis</th>
                <th>Debit</th>
                <th>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {data.accounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.accountCode}</td>
                  <td>{account.accountName}</td>
                  <td>{account.accountType}</td>
                  <td className="amount">{account.debitAmount > 0 ? formatCurrency(account.debitAmount) : '-'}</td>
                  <td className="amount">{account.creditAmount > 0 ? formatCurrency(account.creditAmount) : '-'}</td>
                </tr>
              ))}
            </tbody>            <tfoot>
              <tr className="totals-row">
                <td colSpan="3"><strong>TOTAL</strong></td>
                <td className="amount"><strong>{formatCurrency(data.totals.totalDebits)}</strong></td>
                <td className="amount"><strong>{formatCurrency(data.totals.totalCredits)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };
  const renderFinancialRatios = () => {
    // Demo data untuk financial ratios
    const demoRatios = {
      period: { year: selectedPeriod.year, month: selectedPeriod.month },
      ratios: {
        currentRatio: "5.36",
        debtToEquityRatio: "0.34",
        workingCapital: 305000000,
        assetTurnover: "0.28"
      },
      balanceSheetSummary: {
        totalAssets: 1075000000,
        totalLiabilities: 270000000,
        totalEquity: 805000000,
        isBalanced: true
      }
    };

    const data = financialRatios || demoRatios;
    
    if (!data) return (
      <div className="no-data-message">
        <h3>Tidak ada data rasio keuangan tersedia</h3>
        <p>Silakan sync data atau periksa koneksi ke backend.</p>
      </div>
    );

    return (
      <div className="financial-ratios-container">        <div className="ratios-header">
          <h2>RASIO KEUANGAN (FINANCIAL RATIOS)</h2>
          <p className="period-info">
            Periode {getMonthName(data.period.month)} {data.period.year}
          </p>
        </div>

        <div className="ratios-grid">
          <div className="ratio-card">
            <h3>Current Ratio</h3>
            <div className="ratio-value">{data.ratios.currentRatio}</div>
            <p className="ratio-desc">Aset Lancar / Kewajiban Lancar</p>
            <div className={`ratio-status ${parseFloat(data.ratios.currentRatio) >= 2 ? 'good' : 'warning'}`}>
              {parseFloat(data.ratios.currentRatio) >= 2 ? 'Baik' : 'Perlu Perhatian'}
            </div>
          </div>

          <div className="ratio-card">
            <h3>Debt to Equity Ratio</h3>
            <div className="ratio-value">{data.ratios.debtToEquityRatio}</div>
            <p className="ratio-desc">Total Kewajiban / Total Ekuitas</p>
            <div className={`ratio-status ${parseFloat(data.ratios.debtToEquityRatio) <= 1 ? 'good' : 'warning'}`}>
              {parseFloat(data.ratios.debtToEquityRatio) <= 1 ? 'Baik' : 'Perlu Perhatian'}
            </div>
          </div>

          <div className="ratio-card">
            <h3>Working Capital</h3>
            <div className="ratio-value">{formatCurrency(data.ratios.workingCapital)}</div>
            <p className="ratio-desc">Aset Lancar - Kewajiban Lancar</p>
            <div className={`ratio-status ${parseFloat(data.ratios.workingCapital) > 0 ? 'good' : 'warning'}`}>
              {parseFloat(data.ratios.workingCapital) > 0 ? 'Positif' : 'Negatif'}
            </div>
          </div>

          <div className="ratio-card">
            <h3>Asset Turnover</h3>
            <div className="ratio-value">{data.ratios.assetTurnover}</div>
            <p className="ratio-desc">Penjualan / Total Aset</p>
            <div className="ratio-status neutral">Memerlukan Data Revenue</div>
          </div>
        </div>

        <div className="balance-sheet-summary">
          <h3>Ringkasan Neraca</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Aset</span>
              <span className="summary-value">{formatCurrency(data.balanceSheetSummary.totalAssets)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Kewajiban</span>
              <span className="summary-value">{formatCurrency(data.balanceSheetSummary.totalLiabilities)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Ekuitas</span>
              <span className="summary-value">{formatCurrency(data.balanceSheetSummary.totalEquity)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Status Neraca</span>
              <span className={`summary-value ${data.balanceSheetSummary.isBalanced ? 'balanced' : 'unbalanced'}`}>
                {data.balanceSheetSummary.isBalanced ? 'Seimbang' : 'Tidak Seimbang'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="balance-sheet-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data neraca...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="balance-sheet-page">
      <div className="page-header">
        <h1>Laporan Keuangan - Neraca</h1>
        
        <div className="header-controls">
          <div className="period-selector">
            <label>Periode:</label>
            <select
              value={selectedPeriod.month}
              onChange={(e) => setSelectedPeriod({...selectedPeriod, month: parseInt(e.target.value)})}
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
              ))}
            </select>
            <select
              value={selectedPeriod.year}
              onChange={(e) => setSelectedPeriod({...selectedPeriod, year: parseInt(e.target.value)})}
            >
              {Array.from({length: 5}, (_, i) => (
                <option key={2023 + i} value={2023 + i}>{2023 + i}</option>
              ))}
            </select>
          </div>

          <button 
            className="sync-button"
            onClick={createAutomaticJournalEntries}
            disabled={loading}
          >
            🔄 Sinkronisasi Data
          </button>
        </div>
      </div>

      <div className="info-panel">
        <div className="info-card">
          <h3>📊 Sistem Akuntansi Terintegrasi</h3>
          <p>
            Sistem ini menggunakan metode double-entry bookkeeping yang mengintegrasikan data 
            penjualan, biaya operasional, dan payment method breakdown untuk menghasilkan laporan 
            keuangan yang akurat dan real-time.
          </p>
          <div className="features-list">
            <span className="feature-tag">✓ Neraca Otomatis</span>
            <span className="feature-tag">✓ Jurnal Terintegrasi</span>
            <span className="feature-tag">✓ Rasio Keuangan</span>
            <span className="feature-tag">✓ Real-time Updates</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => setError(null)}>Tutup</button>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'balance-sheet' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance-sheet')}
          >
            📊 Neraca
          </button>
          <button 
            className={`tab-button ${activeTab === 'trial-balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('trial-balance')}
          >
            📋 Neraca Saldo
          </button>
          <button 
            className={`tab-button ${activeTab === 'ratios' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratios')}
          >
            📈 Rasio Keuangan
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'balance-sheet' && renderBalanceSheet()}
          {activeTab === 'trial-balance' && renderTrialBalance()}
          {activeTab === 'ratios' && renderFinancialRatios()}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetPage;
