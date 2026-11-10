import annualReport from "./annual-report.json";
import auditCommittee from "./audit-committee.json";
import barkaPlant from "./barka-plant.json";
import boardOfDirectors from "./board-of-directors.json";
import common from "./common.json";
import contact from "./contact.json";
import csr from "./csr.json";
import dividends from "./dividends.json";
import ethics from "./ethics.json";
import home from "./home.json";
import mainShareholders from "./main-shareholders.json";
import management from "./management.json";
import msxSessions from "./msx-sessions.json";
import ourCompany from "./our-company.json";
import tenders from "./tenders.json";

/** One file per page; shared text is in common.json. Every page reads this combined object. */
const en = {
  ...common,
  ...home,
  ...ourCompany,
  ...mainShareholders,
  ...barkaPlant,
  ...boardOfDirectors,
  ...management,
  ...auditCommittee,
  ...ethics,
  ...dividends,
  ...annualReport,
  ...msxSessions,
  ...csr,
  ...tenders,
  ...contact,
};

export default en;
