import ATSClean from "./ATSClean";
import MinimalDark from "./MinimalDark";
import Arts from "./Arts";
import BCom from "./BCom";
import BSc from "./BSc";
import Design from "./Design";
import Diploma from "./Diploma";
import Engineering from "./Engineering";
import Fresher from "./Fresher";
import Law from "./Law";
import MBA from "./MBA";
import Medical from "./Medical";

export const templates: any = {
  ats: ATSClean,
  minimal: MinimalDark,
  arts: Arts,
  bcom: BCom,
  bsc: BSc,
  design: Design,
  diploma: Diploma,
  engineering: Engineering,
  fresher: Fresher,
  law: Law,
  mba: MBA,
  medical: Medical,
};

export const templateList = [
  { id: "ats", name: "ATS Clean" },
  { id: "modern", name: "Modern Pro" },
  { id: "minimal", name: "Minimal Dark" },
  { id: "arts", name: "Arts / BA" },
  { id: "bcom", name: "B.Com" },
  { id: "bsc", name: "B.Sc" },
  { id: "design", name: "Design" },
  { id: "diploma", name: "Diploma" },
  { id: "engineering", name: "Engineering" },
  { id: "fresher", name: "Fresher" },
  { id: "law", name: "Law" },
  { id: "mba", name: "MBA" },
  { id: "medical", name: "Medical" },
];