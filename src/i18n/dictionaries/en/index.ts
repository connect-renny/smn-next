import alRusailPlant from "./al-rusail-plant.json";
import annualReport from "./annual-report.json";
import auditCommittee from "./audit-committee.json";
import barkaPlant from "./barka-plant.json";
import boardOfDirectors from "./board-of-directors.json";
import common from "./common.json";
import companysPhilosophy from "./companys-philosophy.json";
import contact from "./contact.json";
import csr from "./csr.json";
import dividends from "./dividends.json";
import ethics from "./ethics.json";
import home from "./home.json";
import mainShareholders from "./main-shareholders.json";
import management from "./management.json";
import mediaPage from "./media-page.json";
import msxSessions from "./msx-sessions.json";
import nominationCommittee from "./nomination-committee.json";
import ourCompany from "./our-company.json";
import tenders from "./tenders.json";
import visionMission from "./vision-mission.json";

/** One file per page; shared text is in common.json. Every page reads this combined object. */
const en = {
  ...common,
  ...home,
  ...ourCompany,
  ...visionMission,
  ...mainShareholders,
  ...barkaPlant,
  ...alRusailPlant,
  ...companysPhilosophy,
  ...boardOfDirectors,
  ...management,
  ...auditCommittee,
  ...nominationCommittee,
  ...ethics,
  ...dividends,
  ...annualReport,
  ...msxSessions,
  ...csr,
  ...mediaPage,
  ...tenders,
  ...contact,
};

export default en;
