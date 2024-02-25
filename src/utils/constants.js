const SERVICES_ARRAY = [
  { id: 1, name: "Chimney Repair", code: "CHR" },
  { id: 2, name: "Chimney Installation", code: "CHI" },
  { id: 3, name: "Chimney Sweep", code: "CH" },
  { id: 4, name: "Chimney Cleaning", code: "CH" },
  /// --------------------------------------------- ///
  { id: 5, name: "Carpet Cleaning", code: "CC" },
  { id: 6, name: "Carpet Steam Cleaning", code: "CC" },
  { id: 7, name: "Carpet", code: "CC" },
  /// --------------------------------------------- ///
  { id: 8, name: "Upholstery Cleaning", code: "UC" },
  { id: 9, name: "Upholstery Steam Cleaning", code: "UC" },
  { id: 10, name: "Upholstery", code: "UC" },
  /// --------------------------------------------- ///
  { id: 11, name: "Sofa Cleaning", code: "SC" },
  { id: 12, name: "Sofa Steam Cleaning", code: "SC" },
  { id: 13, name: "Sofa", code: "SC" },
  { id: 14, name: "Couch Cleaning", code: "SC" },
  { id: 15, name: "Couch Steam Cleaning", code: "SC" },
  { id: 16, name: "Couch", code: "SC" },
  /// --------------------------------------------- ///
  { id: 17, name: "Tile Cleaning", code: "TL" },
  { id: 18, name: "Tile Steam Cleaning", code: "TL" },
  { id: 19, name: "Tile", code: "TL" },
  /// --------------------------------------------- ///
  { id: 20, name: "Mattress Cleaning", code: "MC" },
  { id: 21, name: "Mattress Steam Cleaning", code: "MC" },
  { id: 22, name: "Mattress", code: "MC" },
  { id: 23, name: "Bed Cleaning", code: "MC" },
  { id: 24, name: "Bed Steam Cleaning", code: "MC" },
  { id: 25, name: "Bed", code: "MC" },
  /// --------------------------------------------- ///
  { id: 26, name: "Dryer Vent Cleaning", code: "DV" },
  { id: 27, name: "Dryer-Vent Cleaning", code: "DV" },
  { id: 28, name: "DryerVent Cleaning", code: "DV" },
  /// --------------------------------------------- ///
  { id: 29, name: "Dryer Vent Inspection", code: "DVI" },
  { id: 30, name: "Dryer-Vent Inspection", code: "DVI" },
  { id: 31, name: "DryerVent Inspection", code: "DVI" },
  /// --------------------------------------------- ///
  { id: 32, name: "Dryer Vent Repair", code: "DVR" },
  { id: 33, name: "Dryer-Vent Repair", code: "DVR" },
  { id: 34, name: "DryerVent Repair", code: "DVR" },
  /// --------------------------------------------- ///
  { id: 35, name: "More than one item", code: "MX" },
  /// --------------------------------------------- ///
  { id: 36, name: "Air Duct Cleaning", code: "ADC" },
  { id: 37, name: "Air-Duct Cleaning", code: "ADC" },
  { id: 38, name: "AirDuct Cleaning", code: "ADC" },
  { id: 39, name: "Air Duct", code: "ADC" },
  { id: 40, name: "Air-Duct", code: "ADC" },
  { id: 41, name: "AirDuct", code: "ADC" },
  /// --------------------------------------------- ///
  { id: 42, name: "Commercial", code: "COMM" },
  { id: 43, name: "Commercial Cleaning", code: "COMM" },
  { id: 44, name: "Commercial Job", code: "COMM" },
  { id: 44, name: "Commercial Business", code: "COMM" },
  { id: 45, name: "Commercial Contract", code: "COMM" },
  /// --------------------------------------------- ///
  { id: 46, name: "Rug Cleaning", code: "RC" },
  { id: 47, name: "Rug", code: "RC" },
  { id: 48, name: "Rug Steam Cleaning", code: "RC" },
  { id: 48, name: "Rug Steam", code: "RC" },
];

/* example of a LEAD

Binary search tree, build the tree
split request into words (and have some common alternatives, like sofa/couch or mattress/bed)
need a default case for ending nodes incase we can't find the specific service
each node needs a check value AND 
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

const AUTO_GEN_LEAD_TYPES = {
  VPPC: 1,
  MIK: 2,
  OFI: 3,
  CJC: 8,
};
/*
 * Victor's Marketing - 1
 * Mikey - 2
 * Ofir - 3
 * CJC - 8
 */

export { LEAD_SOURCES, SERVICES_ARRAY, AUTO_GEN_LEAD_TYPES };
