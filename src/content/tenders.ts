/**
 * Tenders and their documents, as on smnpower.com/tenders.php and the client's
 * redesign reference. Wording lives in the dictionaries; the status is the client's.
 */
import type { Dictionary } from "@/i18n/get-dictionary";

type Copy = Dictionary["tenders"];

export type TenderId = keyof Copy["titles"];
export type TenderStatus = "open" | "closed";

export type TenderDocument = {
  label: keyof Copy["documents"];
  type: "pdf" | "xlsx";
  href: string;
  /** The Arabic edition, where the file differs by language. */
  hrefAr?: string;
};

export type Tender = {
  id: TenderId;
  status: TenderStatus;
  hasDeadline?: boolean;
  documents: readonly TenderDocument[];
};

const UPLOADS = "https://www.smnpower.com/uploads";
/** Some of the client's file names hold spaces and Arabic, which a URL has to encode. */
const file = (name: string) => `${UPLOADS}/${encodeURIComponent(name)}`;

export const tenders: readonly Tender[] = [
  {
    id: "smnb",
    status: "open",
    documents: [
      {
        label: "invitation",
        type: "pdf",
        href: file("SMNB-English.pdf"),
        hrefAr: file("SMNB-Arabic.pdf"),
      },
    ],
  },
  {
    id: "rpc",
    status: "open",
    documents: [
      {
        label: "invitation",
        type: "pdf",
        href: file("RPC-English.pdf"),
        hrefAr: file("RPC-Arabic.pdf"),
      },
    ],
  },
  {
    id: "bsfc",
    status: "open",
    documents: [
      {
        label: "invitation",
        type: "pdf",
        href: file("BSFC-English.pdf"),
        hrefAr: file("BSFC-Arabic.pdf"),
      },
    ],
  },
  {
    id: "spareParts",
    status: "open",
    hasDeadline: true,
    documents: [
      {
        label: "tenderDocument",
        type: "pdf",
        href: file("Sales RFP_RPC SMN_IFB_Rev 0_280925_مستند المناقصة.pdf"),
      },
      {
        label: "appendixHse",
        type: "pdf",
        href: file("Appendix 1_RPC HSE Policy_الملحق 1_سياسة الصحة والسلامة والبيئة.pdf"),
      },
      {
        label: "appendixSpareParts",
        type: "xlsx",
        href: file("Appendix 2_Spare Parts List_الملحق 2_قائمةقطع الغيار.xlsx"),
      },
      {
        label: "scheduleC",
        type: "xlsx",
        href: file("Schedule C Bid Price Form_نموذج ج لسعر العطاء.xlsx"),
      },
    ],
  },
  {
    id: "fuelOil",
    status: "closed",
    documents: [
      {
        label: "tenderDocument",
        type: "pdf",
        href: file("Fuel-Oil-Tender-Document-August-2022.pdf"),
      },
    ],
  },
  {
    id: "plantEquipment",
    status: "closed",
    documents: [
      {
        label: "announcement",
        type: "pdf",
        href: file("Announcement No.1.pdf"),
        hrefAr: file("اعلان رقم 1.pdf"),
      },
      {
        label: "tenderDocument",
        type: "pdf",
        href: file("P415042_Sales-RFP_RPC-SMN_IFB_Rev.pdf"),
      },
      {
        label: "scheduleDPartB",
        type: "xlsx",
        href: file("Schedule-D-Bid-Price-Form-Part-B-Sell-off.xlsx"),
      },
      {
        label: "scheduleCPartA",
        type: "xlsx",
        href: file("Schedule-C-Bid-Price-Form-Part-A-Sell-off.xlsx"),
      },
      {
        label: "hsePolicy",
        type: "pdf",
        href: file("Appendix1_RPC-HSE-Policy.pdf"),
      },
    ],
  },
];
