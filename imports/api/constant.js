export const coverageType = [{ key: "autoLiability", value: "Auto Liability", labels: { covType: "Policy Type", limType: "Limits Types", combLim: "Combined Single Limits", medPay: "Medical Payments", perPer: "Per Person", perAcc: "Per Accident", dmgPremise: "Damage to Rented Premise", medPay: "Medical Payments", notes: "Notes & Endorsements" } },
{ key: "evidProp", value: "Evidence of Property", labels: { locDesc: "Location Description", perils: "Perils", covType: "Coverage Type", covAmt: "Coverage Amount", val: "Valuation", coIns: "Co-Insurance", av: "Agreed Value", blanket: "Blanket", flood: "Flood", earth: "Earthquake", eqpBreak: "Equipment Breakdown", deduct: "Deductible", end: "Endorsements", notes: "Notes & Endorsements" } },
{ key: "umbrella", value: "Umbrella/Excess	Liability", labels: { polType: "Policy Type", occur: "Occurence", agg: "Aggregate", deduct: "Deductible", notes: "Notes & Endorsements" } },
{ key: "Professional", value: "Professional", labels: { notes: "Notes & Endorsements" } },
{ key: "genLiability", value: "General Liability", labels: { polType: "Policy Type", aggrApplPer: "Aggregate Applied Per", genAgg: "General Aggregate", proAgg: "Products Aggregate", Occurence: "Occurence", perAdvert: "Personal Advertising", dmgPremise: "Damage to Rented Premise", medPay: "Medical Payments", deductible: "Deductible", dedAppTo: "Ded. Applies To", appPer: "Applied Per", notes: "Notes & Endorsements" } },
{ key: "workComp", value: "Workers	Compensation", labels: { empLiLim: "Employer's Liability Limit", deduct: "Deductible", aggDeduct: "Aggregate Deductible", appTo: "Applies To", stat: "Statutory", other: "Other", notes: "Notes & Endorsements" } },
{ key: "docCon", value: "Document/Contract", labels: { notes: "Notes & Endorsements" } }]

export function getCoverageVal(coverageKey) {
  let coverageVal = '';
  coverageType.forEach(function (d, i) {
    if (d.key == coverageKey) {
      coverageVal = d.value;
    }
  });
  return coverageVal;
}

export function getCoverageLabels(coverageKey) {
  let coverageLabels = '';
  coverageType.forEach(function (d, i) {
    if (d.key == coverageKey) {
      coverageLabels = d.labels;
    }
  });
  return coverageLabels;
}
