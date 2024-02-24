// const SERVICES_ARRAY = [
//   { id: 1, name: "Chimney Repair", code: "CHR" },
//   { id: 2, name: "Chimney Installation", code: "CHI" },
//   { id: 3, name: "Chimney Sweep", code: "CH" },
//   { id: 4, name: "Carpet", code: "CC" },
//   { id: 5, name: "Upholstery", code: "UC" },
//   { id: 6, name: "Sofa", code: "SC" },
//   { id: 7, name: "Tile", code: "TL" },
//   { id: 8, name: "Mattress", code: "MC" },
//   { id: 9, name: "Dryer Vent Cleaning", code: "DV" },
//   { id: 10, name: "Dryer Vent Inspection", code: "DVI" },
//   { id: 11, name: "Dryer Vent Repair", code: "DVR" },
//   { id: 12, name: "More than one item", code: "MX" },
//   { id: 13, name: "Air Duct Cleaning", code: "ADC" },
//   { id: 14, name: "Commercial", code: "COMM" },
//   { id: 15, name: "Rug Cleaning", code: "RC" },
// ];

//SIMPLE SOLUTION, create a dictionary and populate with as many possible alternatives as possible

const SERVICES_ARRAY = [
  { id: 1, name: "Chimney Repair", code: "CHR" },
  { id: 2, name: "Chimney Installation", code: "CHI" },
  { id: 3, name: "Chimney Sweep", code: "CH" },
  { id: 4, name: "Carpet Cleaning", code: "CC" },
  { id: 5, name: "Upholstery Cleaning", code: "UC" },
  { id: 6, name: "Sofa Cleaning", code: "SC" },
  { id: 7, name: "Tile Cleaning", code: "TL" },
  { id: 8, name: "Mattress Cleaning", code: "MC" },
  { id: 9, name: "Dryer Vent Cleaning", code: "DV" },
  { id: 10, name: "Dryer Vent Inspection", code: "DVI" },
  { id: 11, name: "Dryer Vent Repair", code: "DVR" },
  { id: 12, name: "More than one item", code: "MX" },
  { id: 13, name: "Air Duct Cleaning", code: "ADC" },
  { id: 14, name: "Commercial", code: "COMM" },
  { id: 15, name: "Rug Cleaning", code: "RC" },
];

/* example of a LEAD

Binary search tree, build the tree
split request into words (and have some common alternatives, like sofa/couch or mattress/bed)
need a default case for ending nodes incase we can't find the specific service
each node needs a check value AND 

Kelly
Upholstery Chimney Sweep
January 16, 2024, 8:00 am
39526 Calle Cabernet, Temecula, California 92591
Nice lady Sectional $179 Ottoman $59 stains.
Tel:9515191643
Confirm: s1j.co/j/FHDOBB
Steam Green
MUST WEAR MASK
Offer Tile, mattress, rugs & upholstery cleaning
Reply STOP to unsubscribe


*/

// Original LIST

const LEAD_SOURCES = [
  { id: 1, name: "Victor's Marketing Services", shortName: "VPPC" },
  { id: 2, name: "Mikey", shortName: "MIK" },
  { id: 3, name: "Ofir", shortName: "OFI" },
  { id: 4, name: "Ben", shortName: "BEN" },
  { id: 5, name: "Yaniv", shortName: "YMB" },
  { id: 6, name: "G-d Bless Inc", shortName: "GBI" },
  { id: 7, name: "TLS", shortName: "TLS" },
  { id: 8, name: "CJC", shortName: "CJC" },
  { id: 9, name: "Bizz Buzz", shortName: "BIZZ" },
  { id: 10, name: "--", shortName: "ADU" },
  { id: 11, name: "--", shortName: "DAV" },
  { id: 12, name: "--", shortName: "SHON" },
  { id: 13, name: "--", shortName: "SUB" },
  { id: 14, name: "--", shortName: "SYN" },
  { id: 15, name: "--", shortName: "AMIE" },
  { id: 16, name: "--", shortName: "AVI" },
];

/*
 * Victor's Marketing - 1
 * Mikey - 2
 * Ofir - 3
 * CJC - 8
 */
const AUTO_GEN_LEAD_SOURCE_IDS = [1, 2, 3, 8];

const AUTO_LEAD_GEN_TYPES = {
  VPPC: 1,
  MIK: 2,
  OFI: 3,
  CJC: 8,
};

export {
  LEAD_SOURCES,
  SERVICES_ARRAY,
  AUTO_GEN_LEAD_SOURCE_IDS,
  AUTO_LEAD_GEN_TYPES,
};
