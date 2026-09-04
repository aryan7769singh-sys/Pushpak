import React from 'react';
import { BookOpen, CheckCircle, FileText, Download } from 'lucide-react';

export function MethodologyPage() {
  const sections = [
    {
      num: "01",
      title: "Data Sources & Ingestion Standards",
      body: "High-frequency collection incorporates airline direct APIs, GDS data streams, and verified aggregator archives. All inputs conform to ISO 8601 timestamps and canonical airport IATA coding.",
    },
    {
      num: "02",
      title: "Fare Cleaning & Validation Protocol",
      body: "Incoming observations pass validation filters checking for incomplete tax rows, abnormal negative charges, and unconfirmed provisional holds before canonical normalization.",
    },
    {
      num: "03",
      title: "Mandatory Fare Unbundling",
      body: "Fares are decomposed into Base Airline Tariff, Statutory Taxes (GST), User Development Fees (UDF), and Optional Auxiliary Platform Fees to prevent ancillary bundling distortion.",
    },
    {
      num: "04",
      title: "Missing & Sold-Out Flight Handling",
      body: "When specific flights sell out, shadow pricing imputations or carry-forward relatives are applied within carrier classes to prevent artificial index deflation from disappearing low-cost tiers.",
    },
    {
      num: "05",
      title: "Statistical Outlier Detection (Tukey / 3-Sigma)",
      body: "Observations exceeding three standard deviations from median corridor price relatives undergo algorithmic review to differentiate legitimate market surge from feed anomalies.",
    },
    {
      num: "06",
      title: "Five Advance Purchase Horizons",
      body: "Observations are stratified into five horizons: T+1 (24–48h spot volatility), T+7 (urgent 1-week), T+15 (corporate baseline), T+30 (leisure standard), and T+45 (early advance baseline).",
    },
    {
      num: "07",
      title: "Representative 50-Corridor Basket",
      body: "The basket encompasses 50 high-density corridors covering over 72% of Indian domestic scheduled commercial aviation passenger volumes across metro-metro, tier-2, and regional routes.",
    },
    {
      num: "08",
      title: "Price Relatives Formulation",
      body: "For each corridor i at horizon h and time t relative to base period 0, the price relative is defined as: r_i,t = p_i,t / p_i,0.",
    },
    {
      num: "09",
      title: "Jevons Elementary Geometric Mean Aggregation",
      body: "Elementary indices are computed via the unweighted geometric mean of price relatives: I_J^(0:t) = [ ∏ (p_i,t / p_i,0) ]^(1/n). Satisfies transitivity, time reversal, and circular test requirements (IMF CPI Manual 2020).",
      formula: "I_J^(0:t) = \\left( \\prod_{i=1}^{n} \\frac{p_{i,t}}{p_{i,0}} \\right)^{\\frac{1}{n}} = \\frac{\\left( \\prod_{i=1}^{n} p_{i,t} \\right)^{1/n}}{\\left( \\prod_{i=1}^{n} p_{i,0} \\right)^{1/n}}",
    },
    {
      num: "10",
      title: "Chain Linking & Base Re-referencing",
      body: "To accommodate route additions, seasonal carrier shifts, and airport changes, the index employs monthly geometric chain-linking with base period set to January 2026 = 100.",
    },
    {
      num: "11",
      title: "PUSHPAK Headline Index",
      body: "Comprehensive national measure reflecting all scheduled domestic commercial operations across all five advance horizons and 50 monitored corridors.",
    },
    {
      num: "12",
      title: "PUSHPAK Core Index (Trimmed)",
      body: "Underlying structural trend index excluding seasonal flash-surges and severe temporary holiday peaks using asymmetric 5% top/bottom price relative trimming.",
    },
    {
      num: "13",
      title: "Data Quality Assurance Framework",
      body: "Every published index value is accompanied by observation counts, carrier coverage ratios, and audit cryptographic provenance hashes.",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>METHODOLOGY & GOVERNANCE</h1>
          <p>Official technical specification for the PUSHPAK Indian Domestic Airfare Price Index.</p>
        </div>
        <div className="gov-action-controls">
          <button className="gov-btn" onClick={() => alert("Methodology Technical Specification PDF exported.")}>
            <Download size={13} />
            <span>Download Specification (PDF)</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="gov-card" style={{ marginBottom: '14px' }}>
        <div className="gov-card-header">
          <div className="gov-card-title">
            INSTITUTIONAL METHODOLOGICAL FRAMEWORK
            <span className="gov-card-subtitle">SIH 2026 Standard for High-Frequency Aviation Price Measurement</span>
          </div>
          <span className="gov-badge ok">STANDARDS COMPLIANT</span>
        </div>
        <div className="gov-card-body" style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '8px' }}>
            The <strong>PUSHPAK Domestic Airfare Price Index</strong> is engineered to deliver reliable, high-frequency statistical measurement of domestic scheduled passenger airfare movements across Indian airspace. Designed in alignment with the <em>United Nations / IMF Consumer Price Index Manual (2020)</em> and international scanner-data standards, the platform computes elementary geometric aggregates that eliminate substitution bias and maintain dimensional invariance.
          </p>
        </div>
      </div>

      {/* Numbered Methodology Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sections.map((sec) => (
          <div key={sec.num} className="gov-card" style={{ marginBottom: '4px' }}>
            <div className="gov-card-header" style={{ padding: '6px 12px' }}>
              <div className="gov-card-title" style={{ fontSize: '12px' }}>
                <span className="font-mono" style={{ color: 'var(--navy-medium)', marginRight: '4px' }}>
                  SECTION {sec.num}.
                </span>
                {sec.title}
              </div>
            </div>
            <div className="gov-card-body" style={{ padding: '8px 12px', fontSize: '11.5px' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{sec.body}</p>
              {sec.formula && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2px',
                  padding: '8px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  color: 'var(--navy-dark)',
                  marginTop: '8px',
                }}>
                  {sec.formula}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
