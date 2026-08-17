import { useState } from "react";

export default function DocumentAnalyzer() {
  const [docType, setDocType] = useState("Commercial Lease Agreement");
  const [matterRef, setMatterRef] = useState("Acme Corp - HQ Relocation (MAT-2024-089)");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden w-full mx-auto p-4 md:p-6 lg:p-8">
      {/* Intake Form Section */}
      <section className="mb-6 bg-parchment-mid border border-primary p-6 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">Document Type</label>
            <div className="relative">
              <select 
                className="w-full bg-surface border-primary text-primary font-body-md py-2 px-3 appearance-none rounded-none focus:ring-0 focus:border-primary"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option>Commercial Lease Agreement</option>
                <option>Non-Disclosure Agreement</option>
                <option>Master Services Agreement</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                <span className="material-symbols-outlined">arrow_drop_down</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">Matter Reference</label>
            <input 
              className="w-full bg-surface border-primary text-primary font-body-md py-2 px-3 rounded-none focus:ring-0 focus:border-primary" 
              type="text" 
              value={matterRef}
              onChange={(e) => setMatterRef(e.target.value)}
            />
          </div>
          <div className="shrink-0 flex gap-3 mt-4 md:mt-0">
            <button className="border border-primary bg-transparent text-primary font-label-sm text-label-sm py-2 px-6 uppercase tracking-wider hover:bg-surface-variant transition-colors">
              Update
            </button>
            <button className="bg-primary text-on-primary font-label-sm text-label-sm py-2 px-6 uppercase tracking-wider hover:bg-primary-container transition-colors flex items-center">
              <span className="material-symbols-outlined mr-2 text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>download</span> Export
            </button>
          </div>
        </div>
      </section>

      {/* Split View Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Pane: Source Document */}
        <div className="flex-1 flex flex-col bg-surface border border-outline-variant min-h-0">
          <div className="bg-surface-variant px-4 py-3 border-b border-outline-variant flex justify-between items-center shrink-0">
            <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Source Document</h2>
            <span className="font-citation text-citation text-secondary">Pg. 1 of 42</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-surface custom-scrollbar">
            <div className="max-w-[720px] mx-auto space-y-6">
              <h3 className="font-headline-md text-headline-md text-primary text-center mb-8 border-b-2 border-primary pb-4">COMMERCIAL LEASE AGREEMENT</h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed text-justify">
                THIS COMMERCIAL LEASE AGREEMENT (the "Lease") is made and entered into this 15th day of November, 2024, by and between GLOBAL PROPERTIES LLC, a Delaware limited liability company ("Landlord"), and ACME CORPORATION, a California corporation ("Tenant").
              </p>
              
              <h4 className="font-headline-md text-headline-md text-primary text-base mt-8 mb-2">1. PREMISES</h4>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed text-justify">
                Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, for the term and subject to the conditions hereinafter set forth, that certain real property commonly known as Suite 400, located at 123 Business Parkway, Metropolis, CA 90210, consisting of approximately 15,400 rentable square feet (the "Premises").
              </p>

              <div className="bg-status-flagged bg-opacity-20 border-l-4 border-error p-4 my-6">
                <h4 className="font-headline-md text-headline-md text-primary text-base mb-2">2. TERM & RENEWAL</h4>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed text-justify">
                  The initial term of this Lease (the "Initial Term") shall be for a period of ten (10) years, commencing on January 1, 2025 (the "Commencement Date") and expiring on December 31, 2034. Tenant shall have one (1) option to renew this Lease for an additional five (5) year period, provided written notice is delivered to Landlord no later than one hundred eighty (180) days prior to the expiration of the Initial Term. Rent during the renewal term shall be determined by Landlord in its sole and absolute discretion based on prevailing market rates, without limitation or cap.
                </p>
              </div>

              <h4 className="font-headline-md text-headline-md text-primary text-base mt-8 mb-2">3. BASE RENT</h4>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed text-justify">
                Tenant agrees to pay to Landlord as Base Rent for the Premises the sum of Forty-Six Thousand Two Hundred Dollars ($46,200.00) per month, payable in advance on the first day of each calendar month during the Term.
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: AI Analysis */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* Executive Summary */}
          <div className="bg-parchment-deep border border-outline-variant shrink-0">
            <div className="bg-surface-variant px-4 py-3 border-b border-outline-variant">
              <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold flex items-center">
                <span className="material-symbols-outlined mr-2 text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span> Executive Summary
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <ul className="space-y-3 font-body-md text-body-md text-on-surface">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-secondary mr-3 mt-1 text-base">check_circle</span>
                  <span><strong>Agreement Type:</strong> Standard 10-year Commercial Lease with a 5-year renewal option.</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-secondary mr-3 mt-1 text-base">check_circle</span>
                  <span><strong>Financials:</strong> Initial Base Rent is $3.00/RSF/month. Triple Net (NNN) lease structure.</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-error mr-3 mt-1 text-base">warning</span>
                  <span><strong>Key Risk:</strong> Uncapped rent escalation during renewal term (Sec 2) heavily favors Landlord.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Clause-Level Analysis */}
          <div className="flex-1 flex flex-col bg-surface border border-outline-variant min-h-0">
            <div className="bg-surface-variant px-4 py-3 border-b border-outline-variant flex justify-between items-center shrink-0">
              <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Clause-Level Analysis</h2>
              <div className="flex gap-2">
                <span className="bg-status-flagged text-error px-2 py-1 font-label-sm text-xs border border-error border-opacity-30">1 Risk Flagged</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
              {/* Standard Clause */}
              <div className="p-4 md:p-6 border-b border-outline-variant border-opacity-20 hover:bg-surface-container-low transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-label-sm text-label-sm text-primary font-bold">Sec 1. Premises</h3>
                  <span className="bg-status-reviewed text-primary-container px-2 py-0.5 font-citation text-xs border border-primary-container border-opacity-30">Standard</span>
                </div>
                <p className="font-body-md text-body-md text-secondary text-sm">
                  Definition of premises aligns with standard commercial practices. RSF is stated; recommend physical measurement verification prior to Commencement Date.
                </p>
              </div>

              {/* Flagged Clause */}
              <div className="p-4 md:p-6 border-b border-outline-variant border-opacity-20 bg-status-flagged bg-opacity-10 border-l-4 border-l-error">
                <div class="flex justify-between items-start mb-2">
                  <h3 className="font-label-sm text-label-sm text-error font-bold flex items-center">
                    <span className="material-symbols-outlined mr-2 text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>flag</span> Sec 2. Term & Renewal
                  </h3>
                  <span className="bg-error text-on-error px-2 py-0.5 font-citation text-xs font-bold uppercase tracking-wider">High Risk</span>
                </div>
                <div className="font-body-md text-body-md text-on-surface text-sm space-y-3">
                  <p>
                    <strong>Issue:</strong> The renewal rent provision grants the Landlord "sole and absolute discretion" to determine the new rate without any caps or references to independent appraisals (e.g., Fair Market Value determined by a third-party broker).
                  </p>
                  <p>
                    <strong>Recommendation:</strong> Revise to state that renewal rent shall be the "Fair Market Rental Value" and insert a standard baseball arbitration clause if the parties cannot agree within 30 days of the renewal notice. Consider adding a cap (e.g., "not to exceed 115% of the Base Rent in Year 10").
                  </p>
                  <div className="pt-3 mt-3 border-t border-error border-opacity-20">
                    <a href="#" className="font-citation text-citation text-primary underline hover:text-error transition-colors text-xs">View Standard Alternate Clause</a>
                  </div>
                </div>
              </div>

              {/* Standard Clause */}
              <div className="p-4 md:p-6 border-b border-outline-variant border-opacity-20 hover:bg-surface-container-low transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-label-sm text-label-sm text-primary font-bold">Sec 3. Base Rent</h3>
                  <span className="bg-status-draft text-secondary px-2 py-0.5 font-citation text-xs border border-secondary border-opacity-30">Review Noted</span>
                </div>
                <p className="font-body-md text-body-md text-secondary text-sm">
                  Base rent calculation matches LOI. Note that operating expenses (CAM, Taxes, Insurance) are handled separately in Sec 4 (not shown in current view).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
