import boardOfDirectors from "./board-of-directors.json";
import common from "./common.json";
import contact from "./contact.json";
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
  ...boardOfDirectors,
  ...management,
  ...ethics,
  ...dividends,
  ...msxSessions,
  ...tenders,
  ...contact,
};

export default en;
