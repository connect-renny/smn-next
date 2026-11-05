/**
 * Dividend history, as listed on smnpower.com/dividends-disclosures.php. Newest
 * first. Dates stay in English on the Arabic page too, as they do on the live site.
 */
export type Dividend = {
  year: string;
  cash: string;
  bonus: string;
  cutOff: string;
  payment: string;
};

export const dividends: readonly Dividend[] = [
  { year: "2025", cash: "73.00%", bonus: "0.00%", cutOff: "Mar 26, 2025", payment: "Apr 08, 2025" },
  { year: "2023", cash: "15.00%", bonus: "0.00%", cutOff: "Mar 29, 2023", payment: "Apr 06, 2023" },
  { year: "2018", cash: "19.00%", bonus: "0.00%", cutOff: "May 01, 2018", payment: "May 07, 2018" },
  { year: "2017", cash: "16.00%", bonus: "0.00%", cutOff: "May 01, 2017", payment: "May 07, 2017" },
  { year: "2016", cash: "15.00%", bonus: "0.00%", cutOff: "Nov 15, 2016", payment: "Nov 21, 2016" },
  { year: "2016", cash: "22.00%", bonus: "0.00%", cutOff: "May 01, 2016", payment: "May 09, 2016" },
  { year: "2015", cash: "22.00%", bonus: "0.00%", cutOff: "Nov 01, 2015", payment: "Nov 08, 2015" },
  { year: "2015", cash: "22.00%", bonus: "0.00%", cutOff: "May 03, 2015", payment: "May 10, 2015" },
  { year: "2014", cash: "20.00%", bonus: "0.00%", cutOff: "Oct 30, 2014", payment: "Nov 05, 2014" },
  { year: "2014", cash: "20.00%", bonus: "0.00%", cutOff: "May 01, 2014", payment: "May 07, 2014" },
  { year: "2013", cash: "22.40%", bonus: "0.00%", cutOff: "Oct 31, 2013", payment: "Nov 07, 2013" },
  { year: "2013", cash: "23.60%", bonus: "0.00%", cutOff: "May 01, 2013", payment: "May 08, 2013" },
  { year: "2012", cash: "36.60%", bonus: "0.00%", cutOff: "Nov 26, 2012", payment: "Dec 04, 2012" },
  { year: "2012", cash: "14.40%", bonus: "0.00%", cutOff: "Jun 03, 2012", payment: "Jun 03, 2012" },
  { year: "2011", cash: "19.30%", bonus: "0.00%", cutOff: "Nov 20, 2011", payment: "Nov 23, 2011" },
];

/** The entries of each year together, keeping the newest-first order. */
export function dividendsByYear(items: readonly Dividend[] = dividends) {
  const years = new Map<string, Dividend[]>();
  for (const item of items) years.set(item.year, [...(years.get(item.year) ?? []), item]);
  return [...years].map(([year, rows]) => ({ year, rows }));
}
