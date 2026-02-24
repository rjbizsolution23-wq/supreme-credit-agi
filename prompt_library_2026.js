/**
 * SUPREME CREDIT DISPUTE PROMPT LIBRARY — 2026 EDITION
 * Updated: February 24, 2026 | All Laws, Rulings & Compliance Current as of Today
 */

const SUPREME_PROMPTS_2026 = {
  metadata: {
    lastUpdated: 'February 24, 2026',
    owner: 'Rick Jefferson',
    version: '2026.3.0 (Full Consolidation)'
  },

  categories: {
    analysis: {
      title: 'AUDIT & FORENSIC ANALYSIS',
      prompts: [
        {
          id: 'v1',
          name: 'Forensic FCRA/Metro 2® Violation Scan',
          shortPrompt: 'Perform a military-grade 10-category FCRA/FDCPA/Metro 2® violation scan.',
          fullPrompt: `You are Supreme Credit Master AGI V17.0. Perform a MILITARY-GRADE FORENSIC AUDIT.
Scan for: Personal Info (1681e(b)), Permissible Purpose (1681b), DOFD Integrity, Re-aging, Balance Inflation, and Metro 2 Cross-Logic (e.g. Account Status 13 with Balance > 0).
Output: Categorized violations with USC/Metro 2 citations and Lethality Score (1-10).`
        },
        {
          id: 'v2',
          name: 'Credit Score Trajectory & Impact',
          shortPrompt: 'Calculate impact of specific actions and create a prioritized optimization plan.',
          fullPrompt: `Generate a SCORE IMPACT ANALYSIS. Calculate impact of actions on FICO components (Payment, Amounts, Length, Mix, New).
Output: Prioritized "Lethal Action List" sorted by ROI (Points vs Effort).`
        },
        {
          id: 'v3',
          name: 'Individual Account Deep Dive',
          shortPrompt: 'Forensic deep dive into a specific account to find technical inaccuracies.',
          fullPrompt: `Perform an ACCOUNT DEEP DIVE. Trace Chain of Custody, Temporal Integrity (DOFD vs DOLA), Field Level Accuracy across bureaus, and Investigation Standards (1681s-2(b)).`
        },
        {
          id: 'v4',
          name: 'Hard Inquiry Permissible Purpose Audit',
          shortPrompt: 'Scan hard inquiries for missing permissible purpose and unauthorized trigger leads.',
          fullPrompt: `Analyze hard inquiries. Scan for: Unmatched pulls (no account opened), Missing Permissible Purpose (1681b), and Trigger Lead violations (Sept 2025 Act).`
        },
        {
          id: 'v5',
          name: 'Public Record & Data Broker Audit',
          shortPrompt: 'Scan for unauthorized data exposure in LexisNexis and public record aggregators.',
          fullPrompt: `Perform a DATA EXPOSURE AUDIT. Scan for LexisNexis, Accurint, and public record mismatches. Check for outdated BK records or incorrect liens citing 2025 compliance rules.`
        }
      ]
    },
    disputes: {
      title: 'ADVANCED DISPUTE TEMPLATES',
      prompts: [
        {
          id: 'd1',
          name: 'High-Velocity Bureau Dispute (Metro 2®)',
          shortPrompt: 'Target multiple technical Metro 2® violations for deletion.',
          fullPrompt: `Generate high-velocity bureau dispute. Cite 1681e(b), 1681i(a)(5)(A), and Metro 2 specific code logic errors. Include warning of 1681n "Willful Non-Compliance" for e-OSCAR automation.`
        },
        {
          id: 'd2',
          name: 'Chain of Assignment / Debt Validation (FDCPA)',
          shortPrompt: 'Demand full chain of title and accounting under 1692g(b) and UCC 9-210.',
          fullPrompt: `Generate formal FDCPA § 809(b) Validation Demand. Demand Full Chain of Assignment and Accounting (UCC 9-210). Assert mandatory cease of collection per 1692g(b).`
        },
        {
          id: 'd3',
          name: 'Pay-for-Delete / Goodwill & Settlment',
          shortPrompt: 'Binding settlement for account deletion or Goodwill removal of late payments.',
          fullPrompt: `Generate Pay-for-Delete or Goodwill Adjustment offer. Include "Condition Precedent" for deletion and "Covenant Not to Sue." For Goodwill, highlight loyalty and non-recurring hardship.`
        },
        {
          id: 'd4',
          name: 'Unauthorized Inquiry Removal Demand',
          shortPrompt: 'Challenge unauthorized hard inquiries citing missing permissible purpose.',
          fullPrompt: `Generate challenge for unauthorized hard inquiries (1681b). Demand suppression/deletion within 15 days for lack of written authorization.`
        },
        {
          id: 'd5',
          name: 'Identity Suppression & File Purification',
          shortPrompt: 'Demand deletion of outdated or inaccurate personal identifiers.',
          fullPrompt: `Attorney-grade suppression letter (1681c). Target multiple name variations, old addresses, and incorrect employment data to prevent "cross-talk" during disputes.`
        },
        {
          id: 'd6',
          name: 'Round 2: Method of Verification (MOV)',
          shortPrompt: 'Demand specific details on HOW the bureau verified the data.',
          fullPrompt: `Generate 1681i(a)(7) MOV Demand. Demand specific identity of individual at furnisher who verified, and documentation of the physical audit conducted.`
        },
        {
          id: 'd7',
          name: 'Medical Debt / Bankruptcy / Specialized',
          shortPrompt: 'Target medical debt (Regulation F) and Bankruptcy public records.',
          fullPrompt: `Specialized dispute targeting Medical Debt (Cal. SB 1061 or HIPAA pivots) and Bankruptcy (Verification of Public Record accuracy/Chain of custody).`
        },
        {
          id: 'd8',
          name: 'Direct Furnisher Dispute (1681s-2(b))',
          shortPrompt: 'Challenge the source of the data directly following bureau investigation.',
          fullPrompt: `Generate direct furnisher dispute. Invoke duty to investigate under 1681s-2(b) and demand evidence of the "accurate" reporting they claimed to bureaus.`
        }
      ]
    },
    roadmaps: {
      title: 'FINANCIAL SUCCESS ROADMAPS',
      prompts: [
        {
          id: 'r1',
          name: '30/60/90 Day Rapid Credit Recovery',
          shortPrompt: 'Week-by-week execution plan to maximize score gains in 90 days.',
          fullPrompt: `30/60/90 Day Action Plan. 1-30: Foundation/Quick Wins. 31-60: Momentum/Round 2. 61-90: Optimization/New Credit Mix.`
        },
        {
          id: 'r2',
          name: 'Mortgage / Auto Loan Readiness',
          shortPrompt: 'Technical blueprint for Home or Auto financing approval.',
          fullPrompt: `Lender Readiness Roadmap. Analyze DTI, Liquidity, and specific Score Targets (FICO 2/4/5 for Mortgage, Auto-Enhanced for Cars).`
        },
        {
          id: 'r3',
          name: 'Student Loan / Budget / Debt Relief',
          shortPrompt: 'Roadmap for student loan management and DTI optimization.',
          fullPrompt: `Debt Relief Roadmap. Federal IDR/PSLF analysis vs Private Refinance. Cash flow optimization and Avalanche vs Snowball payoff strategies.`
        },
        {
          id: 'r4',
          name: 'Business Funding & Credit Blueprint',
          shortPrompt: '12-month timeline to establish business credit and get non-PG funding.',
          fullPrompt: `Business Credit Roadmap. Compliance Setup -> Tier 1-4 Credit Building -> Non-PG Funding Matrix ($100K+ Target).`
        },
        {
          id: 'r5',
          name: 'Identity Theft / Mixed File Resolution',
          shortPrompt: 'Path for resolving mixed files and fraudulent accounts.',
          fullPrompt: `Identity Resolution Roadmap. Separation Demand (1681e(b)) -> Fraud Block (§ 1681c-2) -> FTC Affidavit integration.`
        }
      ]
    },
    legal: {
      title: 'LEGAL & LITIGATION ACTIONS',
      prompts: [
        {
          id: 'l1',
          name: 'Pre-Suit Demand / Cease & Desist',
          shortPrompt: 'Final attorney-form demand letter before filing a federal lawsuit.',
          fullPrompt: `Pre-Suit Demand. Cite violations, Evidence Log of previous failures, monetary damages sought, and final 15-day deadline before Federal Litigation.`
        },
        {
          id: 'l2',
          name: 'Federal Court / Small Claims Complaint',
          shortPrompt: 'Draft complaint for U.S. District Court or Small Claims.',
          fullPrompt: `Draft Legal Complaint. Pleading format: Parties, Jurisdiction, Facts, Causes of Action (1681n/o), and Prayer for Relief (Actual + Statutory + Punitive).`
        },
        {
          id: 'l3',
          name: 'AAA/JAMS Arbitration Demand',
          shortPrompt: 'Formal demand for arbitration to bypass class-action waivers.',
          fullPrompt: `Arbitration Demand. Cite contract Clause for Arbitration, specify dispute, and demand Defendant pay all forum fees per consumer arbitration rules.`
        },
        {
          id: 'l4',
          name: 'Regulatory Complaints (FTC/AG)',
          shortPrompt: 'Calibrated packages for FTC and State Attorney General filings.',
          fullPrompt: `Regulatory Complaint Pack. Detailed narrative for FTC/AG reporting, citing systemic violations and consumer harm to trigger agency inquiry.`
        },
        {
          id: 'l5',
          name: 'Affidavits of Fact/Damages/Non-Receipt',
          shortPrompt: 'Notarizable affidavits to support litigation and debt challenges.',
          fullPrompt: `Legal Affidavits. Sworn statements of fact, loss, or lack of response. Essential for "Prima Facie" evidence in court or arbitration.`
        }
      ]
    }
  },

  citations: [
    { law: 'FCRA — Basic Accuracy', citation: '15 U.S.C. § 1681e(b)', right: 'Maximum possible accuracy in reporting', status: 'Active' },
    { law: 'FCRA — Reinvestigation', citation: '15 U.S.C. § 1681i(a)(1)(A)', right: '30-day investigation mandate', status: 'Active' },
    { law: 'FCRA — Method of Verification', citation: '15 U.S.C. § 1681i(a)(7)', right: 'Demand who verified and how', status: 'Active' },
    { law: 'FCRA — Security Freeze', citation: '15 U.S.C. § 1681c-1', right: 'Free freeze on all CRA files', status: 'Active' },
    { law: 'FCRA — Willful Violations', citation: '15 U.S.C. § 1681n', right: 'Statutory damages + punitive', status: 'Active' },
    { law: 'FCRA — Furnisher Duty', citation: '15 U.S.C. § 1681s-2(b)', right: 'Investigate after CRA notice', status: 'Active' },
    { law: 'FCRA — Sept 2025 Law', citation: 'H.R. 2808', right: 'Prohibits trigger leads in mortgage', status: 'NEW' },
    { law: 'FDCPA — Validation', citation: '15 U.S.C. § 1692g(b)', right: 'Cease collection until validated', status: 'Active' },
    { law: 'Regulation F — Itemization', citation: '12 CFR § 1006.34', right: 'Required debt breakdown', status: 'Active' },
    { law: 'UCC — Accounting', citation: 'UCC § 9-210', right: 'Account statement demand', status: 'Secondary' },
    { law: 'Medical Debt — CA', citation: 'Cal. SB 1061', right: 'No medical debt on CA reports', status: 'State Law' }
  ]
};

window.SUPREME_PROMPTS_2026 = SUPREME_PROMPTS_2026;
