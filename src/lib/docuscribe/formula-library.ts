/**
 * DocuSCRIBE™ — Formula Library
 *
 * @classification DATA_SERVICE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Engineering and architectural formula repository for document insertion.
 * Provides over 30 standard technical formulas with definitions and insert text.
 */

export type FormulaCategory =
  | 'Structural'
  | 'Geotechnical'
  | 'Concrete & Steel'
  | 'Electrical'
  | 'Hydraulics'
  | 'Site & Survey'
  | 'Mathematics';

export interface FormulaVariable {
  symbol: string;
  definition: string;
  unit: string;
}

export interface EngineeringFormula {
  id: string;
  name: string;
  category: FormulaCategory;
  expression: string; // mathematical representation, suitable for display
  description: string;
  variables: FormulaVariable[];
  insertText: string; // Markdown/plaintext block to insert into canvas
}

const buildInsertText = (f: Omit<EngineeringFormula, 'insertText' | 'id'>): string => {
  let text = `\n### ${f.name}\n**Formula:** \`${f.expression}\`\n\n*${f.description}*\n\n**Variables:**\n`;
  f.variables.forEach(v => {
    text += `- **${v.symbol}**: ${v.definition} [${v.unit}]\n`;
  });
  return text + '\n';
};

const formulaData: Omit<EngineeringFormula, 'insertText' | 'id'>[] = [
  // --- Structural ---
  {
    name: "Maximum Bending Moment (Simply Supported Beam, Uniform Load)",
    category: "Structural",
    expression: "M = wL² / 8",
    description: "Calculates the maximum bending moment for a simply supported beam subject to a uniformly distributed load over its entire length.",
    variables: [
      { symbol: "M", definition: "Maximum bending moment", unit: "kNm or lb-ft" },
      { symbol: "w", definition: "Uniform load per unit length", unit: "kN/m or lb/ft" },
      { symbol: "L", definition: "Length of the span", unit: "m or ft" }
    ]
  },
  {
    name: "Maximum Deflection (Simply Supported Beam, Uniform Load)",
    category: "Structural",
    expression: "Δ = (5wL⁴) / (384EI)",
    description: "Calculates the maximum deflection at the center of a simply supported beam with a uniform distributed load.",
    variables: [
      { symbol: "Δ", definition: "Maximum deflection", unit: "mm or in" },
      { symbol: "w", definition: "Uniform load per unit length", unit: "kN/m or lb/ft" },
      { symbol: "L", definition: "Length of the span", unit: "m or ft" },
      { symbol: "E", definition: "Modulus of elasticity", unit: "MPa or psi" },
      { symbol: "I", definition: "Moment of inertia", unit: "mm⁴ or in⁴" }
    ]
  },
  {
    name: "Axial Stress",
    category: "Structural",
    expression: "σ = P / A",
    description: "Calculates the normal stress on a cross-section due to an axial force.",
    variables: [
      { symbol: "σ", definition: "Axial stress", unit: "MPa or psi" },
      { symbol: "P", definition: "Axial force", unit: "N or lbf" },
      { symbol: "A", definition: "Cross-sectional area", unit: "mm² or in²" }
    ]
  },
  {
    name: "Euler Buckling Load (Column)",
    category: "Structural",
    expression: "P_cr = (π²EI) / (KL)²",
    description: "Calculates the critical compressive load at which a column will buckle.",
    variables: [
      { symbol: "P_cr", definition: "Critical buckling load", unit: "N or lbf" },
      { symbol: "E", definition: "Modulus of elasticity", unit: "MPa or psi" },
      { symbol: "I", definition: "Minimum moment of inertia", unit: "mm⁴ or in⁴" },
      { symbol: "K", definition: "Effective length factor", unit: "dimensionless" },
      { symbol: "L", definition: "Unsupported length of column", unit: "m or ft" }
    ]
  },

  // --- Geotechnical ---
  {
    name: "Terzaghi's Bearing Capacity",
    category: "Geotechnical",
    expression: "q_u = c'N_c + σ'N_q + 0.5γBN_γ",
    description: "Estimates the ultimate bearing capacity of shallow foundations.",
    variables: [
      { symbol: "q_u", definition: "Ultimate bearing capacity", unit: "kPa or psf" },
      { symbol: "c'", definition: "Effective cohesion", unit: "kPa or psf" },
      { symbol: "σ'", definition: "Effective overburden pressure at foundation level", unit: "kPa or psf" },
      { symbol: "γ", definition: "Unit weight of soil", unit: "kN/m³ or lb/ft³" },
      { symbol: "B", definition: "Width of foundation", unit: "m or ft" },
      { symbol: "N_c, N_q, N_γ", definition: "Bearing capacity factors", unit: "dimensionless" }
    ]
  },
  {
    name: "Earth Pressure (Rankine Active)",
    category: "Geotechnical",
    expression: "P_A = 0.5 * K_a * γ * H²",
    description: "Total active earth pressure per unit length of wall.",
    variables: [
      { symbol: "P_A", definition: "Total active earth pressure", unit: "kN/m or lb/ft" },
      { symbol: "K_a", definition: "Active earth pressure coefficient", unit: "dimensionless" },
      { symbol: "γ", definition: "Unit weight of soil", unit: "kN/m³ or lb/ft³" },
      { symbol: "H", definition: "Height of retaining wall", unit: "m or ft" }
    ]
  },

  // --- Concrete & Steel ---
  {
    name: "Concrete Compressive Strength",
    category: "Concrete & Steel",
    expression: "f'_c = P_fail / A",
    description: "Specified compressive strength of concrete, calculated from cylinder failure test.",
    variables: [
      { symbol: "f'_c", definition: "Compressive strength", unit: "MPa or psi" },
      { symbol: "P_fail", definition: "Load at failure", unit: "N or lbf" },
      { symbol: "A", definition: "Cross-sectional area of test cylinder", unit: "mm² or in²" }
    ]
  },
  {
    name: "Steel Yield Stress",
    category: "Concrete & Steel",
    expression: "F_y = P_yield / A_0",
    description: "Yield point stress of reinforcing or structural steel.",
    variables: [
      { symbol: "F_y", definition: "Yield stress", unit: "MPa or psi" },
      { symbol: "P_yield", definition: "Load at yield point", unit: "N or lbf" },
      { symbol: "A_0", definition: "Original cross-sectional area", unit: "mm² or in²" }
    ]
  },

  // --- Electrical ---
  {
    name: "Ohm's Law",
    category: "Electrical",
    expression: "V = I * R",
    description: "Fundamental relationship between voltage, current, and resistance.",
    variables: [
      { symbol: "V", definition: "Voltage", unit: "V" },
      { symbol: "I", definition: "Current", unit: "A" },
      { symbol: "R", definition: "Resistance", unit: "Ω" }
    ]
  },
  {
    name: "Electrical Power (DC)",
    category: "Electrical",
    expression: "P = V * I",
    description: "Power dissipation in a DC circuit.",
    variables: [
      { symbol: "P", definition: "Power", unit: "W" },
      { symbol: "V", definition: "Voltage", unit: "V" },
      { symbol: "I", definition: "Current", unit: "A" }
    ]
  },
  {
    name: "Electrical Power (AC, Single Phase)",
    category: "Electrical",
    expression: "P = V * I * cos(θ)",
    description: "Real power in an AC circuit.",
    variables: [
      { symbol: "P", definition: "Real Power", unit: "W" },
      { symbol: "V", definition: "RMS Voltage", unit: "V" },
      { symbol: "I", definition: "RMS Current", unit: "A" },
      { symbol: "cos(θ)", definition: "Power factor", unit: "dimensionless" }
    ]
  },
  {
    name: "Voltage Drop (Single Phase)",
    category: "Electrical",
    expression: "V_d = (2 * K * I * L) / A",
    description: "Estimates voltage drop over a run of conductor.",
    variables: [
      { symbol: "V_d", definition: "Voltage drop", unit: "V" },
      { symbol: "K", definition: "Conductor resistivity constant", unit: "Ohm-cmil/ft" },
      { symbol: "I", definition: "Current", unit: "A" },
      { symbol: "L", definition: "One-way length of circuit", unit: "ft" },
      { symbol: "A", definition: "Conductor cross-sectional area", unit: "cmil" }
    ]
  },

  // --- Hydraulics ---
  {
    name: "Manning's Equation (Velocity)",
    category: "Hydraulics",
    expression: "V = (1/n) * R^(2/3) * S^(1/2)  [SI Units]",
    description: "Calculates average velocity in an open channel.",
    variables: [
      { symbol: "V", definition: "Average velocity", unit: "m/s" },
      { symbol: "n", definition: "Manning's roughness coefficient", unit: "dimensionless" },
      { symbol: "R", definition: "Hydraulic radius (A/P)", unit: "m" },
      { symbol: "S", definition: "Channel slope", unit: "m/m" }
    ]
  },
  {
    name: "Hazens-Williams Equation (Friction Loss)",
    category: "Hydraulics",
    expression: "h_f = 10.67 * L * Q^1.85 / (C^1.85 * D^4.87) [SI Units]",
    description: "Head loss in a pipe due to friction.",
    variables: [
      { symbol: "h_f", definition: "Friction head loss", unit: "m" },
      { symbol: "L", definition: "Length of pipe", unit: "m" },
      { symbol: "Q", definition: "Flow rate", unit: "m³/s" },
      { symbol: "C", definition: "Hazen-Williams roughness constant", unit: "dimensionless" },
      { symbol: "D", definition: "Pipe inner diameter", unit: "m" }
    ]
  },
  {
    name: "Continuity Equation",
    category: "Hydraulics",
    expression: "Q = A * V",
    description: "Principle of conservation of mass in fluid flow.",
    variables: [
      { symbol: "Q", definition: "Flow rate", unit: "m³/s or cfs" },
      { symbol: "A", definition: "Cross-sectional flow area", unit: "m² or ft²" },
      { symbol: "V", definition: "Flow velocity", unit: "m/s or ft/s" }
    ]
  },

  // --- Site & Survey ---
  {
    name: "Slope/Grade Calculation",
    category: "Site & Survey",
    expression: "S = (ΔE / D) * 100",
    description: "Calculates the percentage slope between two points.",
    variables: [
      { symbol: "S", definition: "Slope", unit: "%" },
      { symbol: "ΔE", definition: "Change in elevation (Rise)", unit: "m or ft" },
      { symbol: "D", definition: "Horizontal distance (Run)", unit: "m or ft" }
    ]
  },
  {
    name: "Earthwork Volume (Average End Area)",
    category: "Site & Survey",
    expression: "V = L * (A1 + A2) / 2",
    description: "Estimates cut/fill volume between two cross-sections.",
    variables: [
      { symbol: "V", definition: "Volume", unit: "m³ or yd³" },
      { symbol: "L", definition: "Distance between stations", unit: "m or ft" },
      { symbol: "A1, A2", definition: "Cross-sectional areas at stations 1 and 2", unit: "m² or ft²" }
    ]
  },

  // --- Mathematics ---
  {
    name: "Pythagorean Theorem",
    category: "Mathematics",
    expression: "c² = a² + b²",
    description: "Relates lengths of legs to hypotenuse in a right triangle.",
    variables: [
      { symbol: "c", definition: "Hypotenuse length", unit: "unit" },
      { symbol: "a, b", definition: "Leg lengths", unit: "unit" }
    ]
  },
  {
    name: "Area of a Circle",
    category: "Mathematics",
    expression: "A = π * r²",
    description: "Calculate area from radius.",
    variables: [
      { symbol: "A", definition: "Area", unit: "unit²" },
      { symbol: "r", definition: "Radius", unit: "unit" }
    ]
  },
  {
    name: "Volume of a Cylinder",
    category: "Mathematics",
    expression: "V = π * r² * h",
    description: "Calculates the volume of a right circular cylinder.",
    variables: [
      { symbol: "V", definition: "Volume", unit: "unit³" },
      { symbol: "r", definition: "Radius of base", unit: "unit" },
      { symbol: "h", definition: "Height", unit: "unit" }
    ]
  }
];

export const FORMULA_LIBRARY: EngineeringFormula[] = formulaData.map((f, i) => ({
  ...f,
  id: `formula-${i}`,
  insertText: buildInsertText(f)
}));

/**
 * Normalizes string for searching (lowercase, remove punctuation)
 */
const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '');

/**
 * Searches the formula library by query.
 * Matches on name, category, expression, and description.
 */
export function searchFormulas(query: string): EngineeringFormula[] {
  if (!query || query.trim() === '') return FORMULA_LIBRARY;
  
  const normalizedQuery = normalizeString(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return FORMULA_LIBRARY.filter(formula => {
    const searchableText = normalizeString(`${formula.name} ${formula.category} ${formula.description} ${formula.expression}`);
    // All search terms must match somewhere in the text
    return terms.every(term => searchableText.includes(term));
  });
}

/**
 * Returns all available formula categories containing at least one formula.
 */
export function getAvailableCategories(): FormulaCategory[] {
  const categories = new Set(FORMULA_LIBRARY.map(f => f.category));
  return Array.from(categories).sort();
}

/**
 * Gets formulas for a specific category.
 */
export function getFormulasByCategory(category: FormulaCategory): EngineeringFormula[] {
  return FORMULA_LIBRARY.filter(f => f.category === category);
}
