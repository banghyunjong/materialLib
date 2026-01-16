// Define the valid codes matching the UI components
export const FIBER_CODES = [
  "CO", "LI", "WO", "SE", "PE", "NA", "PU", "EL", "AC", "VI", "MD", "TE", "MI", "CA"
];

export const FABRIC_PROPERTY_MAP = {
  "PL": "평직 (Plain)", "PO": "평직 (Plain)", "PB": "평직 (Plain)", "PR": "평직 (Plain)", "PP": "평직 (Plain)", "PC": "평직 (Plain)",
  "TW": "능직 (Twill)", "TD": "능직 (Twill)", "TH": "능직 (Twill)", "TB": "능직 (Twill)", "TS": "능직 (Twill)",
  "SA": "주자직 (Satin)", "SN": "주자직 (Satin)", "SC": "주자직 (Satin)",
  "DO": "변형 (Fancy)", "DP": "변형 (Fancy)", "JA": "변형 (Fancy)", "VL": "변형 (Fancy)", "CO": "변형 (Fancy)", "SE": "변형 (Fancy)",
  "KS": "니트 (Knit)", "KI": "니트 (Knit)", "KR": "니트 (Knit)",
  "ZZ": "기타 (Etc)"
};

export const FABRIC_ANALYSIS_PROMPT = `
# Role
You are a Fashion Fabric Data Specialist. Your task is to parse unstructured fabric specification strings into a highly structured JSON format.

# Output Schema (Strict JSON)
You must output ONLY a valid JSON object matching exactly this structure:

{
  "meta": {
    "original_text": "String (The exact input string provided by user)",
    "etc_info": "String (Any significant information from the input that was NOT parsed into the specific fields below, or raw notes. Leave empty if everything was parsed.)",
    "ai_analysis_kr": "String (Comprehensive analysis in Korean: Describe the fabric characteristics, texture, and typical usage based on the specs. e.g. '이 원단은 70D 나일론 타스란으로 제작되어 내구성이 뛰어나며, 발수 가공이 되어 있어 아웃도어 재킷이나 바람막이 용도로 적합합니다.')",
    "predicted_material": "String (e.g. Nylon, Polyester, Cotton - inferred from hints like Taslan, T-density, Oxford)",
    "construction_type": "String (e.g. Taslan, Taffeta, Oxford, Twill)"
  },
  "compositions": [
    {
      "fiberType": "String (Must be one of: CO, LI, WO, SE, PE, NA, PU, EL, AC, VI, MD, TE, MI, CA)",
      "percentage": "Number (Integer, e.g. 100, 60, 40)"
    }
  ],
  "yarn_spec": {
    "warp": {
      "raw_text": "String (e.g. 70D/36F FDY FD)",
      "denier": "Number or null",
      "filament": "Number or null",
      "process_type": "String (e.g. FDY, DTY, ATY, ITY) or null",
      "luster": "String (e.g. FD, SD, BR, TKT) or null"
    },
    "weft": {
      "raw_text": "String (e.g. 160D/96F ATY FD)",
      "denier": "Number or null",
      "filament": "Number or null",
      "process_type": "String (e.g. FDY, DTY, ATY, ITY) or null",
      "luster": "String (e.g. FD, SD, BR, TKT) or null"
    }
  },
  "physical_spec": {
    "density_total": "Number (e.g. 228) or null",
    "weight_gsm": "Number (e.g. 120) or null",
    "width_inch": "String (e.g. 58/60) or null",
    "finishings_code": [ "Array of Strings (e.g. PD, WR, PU)" ],
    "finishings_desc": [ "Array of Strings (e.g. Plain Dyed, Water Repellent)" ]
  },
  "ui_view": {
    "fabric_code": "String (One of: PL, PO, PB, PR, PP, PC, TW, TD, TH, TB, TS, SA, SN, SC, DO, DP, JA, VL, CO, SE, KS, KI, KR, ZZ)",
    "fabric_name_kr": "String (e.g. 기본 평직, 옥스포드, 능직)"
  }
}

# Mapping Rules for 'compositions' (Fiber Type)
- Nylon -> NA
- Polyester -> PE
- Cotton -> CO
- Linen -> LI
- Wool -> WO
- Silk -> SE
- Polyurethane/Spandex -> PU or EL
- Acrylic -> AC
- Viscose/Rayon -> VI
- Modal -> MD
- Lyocell/Tencel -> TE
- Microfiber -> MI
- Cashmere -> CA

* If exact percentage is missing but implied (e.g. "Nylon 100%"), set 100.
* If multiple materials (e.g. "C/N 60/40"), split accordingly (CO: 60, NA: 40).
* If unknown, default to PE 100 or NA 100 based on hints.

# Mapping Rules for 'ui_view.fabric_code'
Analyze the text to determine the weave type:
- IF "Oxford" -> return "PO"
- IF "Ripstop" -> return "PR"
- IF "Twill" -> return "TW"
- IF "Satin" -> return "SA"
- IF "Dobby" -> return "DO"
- IF "Jersey" -> return "KS"
- IF "Taslan" OR "Plain" OR No specific weave mentioned -> return "PL"
- ELSE -> return "ZZ"

# Parsing Rules
1. **Yarn Count & Luster:** 
   - Split by '*' or 'x'. First is Warp, second is Weft. 
   - **Process Type:** Look for FDY, DTY, ATY, ITY.
   - **Luster:** Look specifically for "FD" (Full Dull), "SD" (Semi Dull), "BR" (Bright), "TKT". 
     - *Important:* "FDY" is a Process, "FD" is a Luster. Do not confuse them. If text says "FDY FD", Process is FDY and Luster is FD.
2. **Density:** If "228T" -> density_total: 228.
3. **Weight:** Remove 'GSM', 'g/y'.
4. **Width:** Look for numbers followed by quotes (") or 'inch' (e.g., 56", 58", 44"). Also look for ranges like 58/60. Extract this as width_inch.
5. **General:** If not found, return null.

# Input Data
The user will provide the raw string.
`;