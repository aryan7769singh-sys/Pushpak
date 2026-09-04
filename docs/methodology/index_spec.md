# PUSHPAK Index Methodology Specification (SIH 2026)

## 1. Index Objectives
To provide a high-frequency, statistically rigorous, CPI-aligned domestic airfare price index representing Indian aviation economics.

## 2. Core Methodological Pillars

### Advance Purchase Horizons
Airfare pricing is non-stationary and dynamically priced based on lead time. PUSHPAK tracks five distinct purchase horizons:
- **$T+1$**: Last-minute spot market volatility (emergency travel, dynamic surge).
- **$T+7$**: One-week advance purchase (short-term corporate / urgent discretionary).
- **$T+15$**: Two-week horizon (standard domestic corporate & business planning).
- **$T+30$**: One-month horizon (leisure baseline, standard discretionary travel).
- **$T+45$**: Extended advance horizon (lowest fare baseline, vacation planning).

### Index Formulations
- **Elementary Aggregate**: Jevons geometric mean of price relatives:
  $$I_{J}^{0:t} = \prod_{i=1}^{n} \left( \frac{p_{i,t}}{p_{i,0}} \right)^{\frac{1}{n}} = \frac{\left( \prod_{i=1}^{n} p_{i,t} \right)^{1/n}}{\left( \prod_{i=1}^{n} p_{i,0} \right)^{1/n}}$$
- **PUSHPAK Headline Index**: Complete weighted domestic basket across all routes and carriers.
- **PUSHPAK Core Index**: Volatility-filtered basket removing temporary seasonal outliers and high-volatility flash surges.
- **CPI Alignment**: Estimation of the transport component impact on headline Consumer Price Index (CPI).

*(Note: Mathematical computation engines will be implemented in subsequent phases following dataset finalization.)*
