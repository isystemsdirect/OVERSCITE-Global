/**
 * DocuSCRIBE™ — Element Library (Periodic Table)
 *
 * @classification DATA_SERVICE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Comprehensive periodic table dataset for technical document authoring.
 * Includes formatting helper for inserting Element data into documents.
 */

export type ElementCategory = 
  | 'Alkali Metal'
  | 'Alkaline Earth Metal'
  | 'Transition Metal'
  | 'Post-Transition Metal'
  | 'Metalloid'
  | 'Reactive Nonmetal'
  | 'Noble Gas'
  | 'Lanthanide'
  | 'Actinide'
  | 'Unknown';

export interface ChemicalElement {
  atomic_number: number;
  symbol: string;
  name: string;
  atomic_mass: number;
  category: ElementCategory;
  group: number | null; // 1-18, null for f-block
  period: number;     // 1-7
  density: number | null; // g/cm³
  melting_point: number | null; // Kelvin
  boiling_point: number | null; // Kelvin
}

export const ELEMENT_LIBRARY: ChemicalElement[] = [
  // Period 1
  { atomic_number: 1, symbol: "H", name: "Hydrogen", atomic_mass: 1.008, category: "Reactive Nonmetal", group: 1, period: 1, density: 0.00008988, melting_point: 13.99, boiling_point: 20.271 },
  { atomic_number: 2, symbol: "He", name: "Helium", atomic_mass: 4.0026, category: "Noble Gas", group: 18, period: 1, density: 0.0001786, melting_point: 0.95, boiling_point: 4.222 },
  
  // Period 2
  { atomic_number: 3, symbol: "Li", name: "Lithium", atomic_mass: 6.94, category: "Alkali Metal", group: 1, period: 2, density: 0.534, melting_point: 453.65, boiling_point: 1603 },
  { atomic_number: 4, symbol: "Be", name: "Beryllium", atomic_mass: 9.0122, category: "Alkaline Earth Metal", group: 2, period: 2, density: 1.85, melting_point: 1560, boiling_point: 2742 },
  { atomic_number: 5, symbol: "B", name: "Boron", atomic_mass: 10.81, category: "Metalloid", group: 13, period: 2, density: 2.08, melting_point: 2349, boiling_point: 4200 },
  { atomic_number: 6, symbol: "C", name: "Carbon", atomic_mass: 12.011, category: "Reactive Nonmetal", group: 14, period: 2, density: 2.267, melting_point: 3800, boiling_point: 4300 },
  { atomic_number: 7, symbol: "N", name: "Nitrogen", atomic_mass: 14.007, category: "Reactive Nonmetal", group: 15, period: 2, density: 0.0012506, melting_point: 63.15, boiling_point: 77.355 },
  { atomic_number: 8, symbol: "O", name: "Oxygen", atomic_mass: 15.999, category: "Reactive Nonmetal", group: 16, period: 2, density: 0.001429, melting_point: 54.36, boiling_point: 90.188 },
  { atomic_number: 9, symbol: "F", name: "Fluorine", atomic_mass: 18.998, category: "Reactive Nonmetal", group: 17, period: 2, density: 0.001696, melting_point: 53.48, boiling_point: 85.03 },
  { atomic_number: 10, symbol: "Ne", name: "Neon", atomic_mass: 20.180, category: "Noble Gas", group: 18, period: 2, density: 0.0009002, melting_point: 24.56, boiling_point: 27.104 },

  // Period 3
  { atomic_number: 11, symbol: "Na", name: "Sodium", atomic_mass: 22.990, category: "Alkali Metal", group: 1, period: 3, density: 0.968, melting_point: 370.944, boiling_point: 1156.090 },
  { atomic_number: 12, symbol: "Mg", name: "Magnesium", atomic_mass: 24.305, category: "Alkaline Earth Metal", group: 2, period: 3, density: 1.738, melting_point: 923, boiling_point: 1363 },
  { atomic_number: 13, symbol: "Al", name: "Aluminum", atomic_mass: 26.982, category: "Post-Transition Metal", group: 13, period: 3, density: 2.70, melting_point: 933.47, boiling_point: 2743 },
  { atomic_number: 14, symbol: "Si", name: "Silicon", atomic_mass: 28.085, category: "Metalloid", group: 14, period: 3, density: 2.329, melting_point: 1687, boiling_point: 3538 },
  { atomic_number: 15, symbol: "P", name: "Phosphorus", atomic_mass: 30.974, category: "Reactive Nonmetal", group: 15, period: 3, density: 1.823, melting_point: 317.30, boiling_point: 553.7 },
  { atomic_number: 16, symbol: "S", name: "Sulfur", atomic_mass: 32.06, category: "Reactive Nonmetal", group: 16, period: 3, density: 2.067, melting_point: 388.36, boiling_point: 717.8 },
  { atomic_number: 17, symbol: "Cl", name: "Chlorine", atomic_mass: 35.45, category: "Reactive Nonmetal", group: 17, period: 3, density: 0.003214, melting_point: 171.6, boiling_point: 239.11 },
  { atomic_number: 18, symbol: "Ar", name: "Argon", atomic_mass: 39.95, category: "Noble Gas", group: 18, period: 3, density: 0.001784, melting_point: 83.81, boiling_point: 87.302 },

  // Period 4 (Selected key metals for UI brevity, full table implementation can expand this)
  { atomic_number: 19, symbol: "K", name: "Potassium", atomic_mass: 39.098, category: "Alkali Metal", group: 1, period: 4, density: 0.862, melting_point: 336.7, boiling_point: 1032 },
  { atomic_number: 20, symbol: "Ca", name: "Calcium", atomic_mass: 40.078, category: "Alkaline Earth Metal", group: 2, period: 4, density: 1.54, melting_point: 1115, boiling_point: 1757 },
  { atomic_number: 22, symbol: "Ti", name: "Titanium", atomic_mass: 47.867, category: "Transition Metal", group: 4, period: 4, density: 4.506, melting_point: 1941, boiling_point: 3560 },
  { atomic_number: 24, symbol: "Cr", name: "Chromium", atomic_mass: 51.996, category: "Transition Metal", group: 6, period: 4, density: 7.15, melting_point: 2180, boiling_point: 2944 },
  { atomic_number: 26, symbol: "Fe", name: "Iron", atomic_mass: 55.845, category: "Transition Metal", group: 8, period: 4, density: 7.874, melting_point: 1811, boiling_point: 3134 },
  { atomic_number: 28, symbol: "Ni", name: "Nickel", atomic_mass: 58.693, category: "Transition Metal", group: 10, period: 4, density: 8.908, melting_point: 1728, boiling_point: 3003 },
  { atomic_number: 29, symbol: "Cu", name: "Copper", atomic_mass: 63.546, category: "Transition Metal", group: 11, period: 4, density: 8.96, melting_point: 1357.77, boiling_point: 2835 },
  { atomic_number: 30, symbol: "Zn", name: "Zinc", atomic_mass: 65.38, category: "Transition Metal", group: 12, period: 4, density: 7.14, melting_point: 692.68, boiling_point: 1180 },
  
  // Period 5 (Selected)
  { atomic_number: 47, symbol: "Ag", name: "Silver", atomic_mass: 107.87, category: "Transition Metal", group: 11, period: 5, density: 10.49, melting_point: 1234.93, boiling_point: 2435 },
  { atomic_number: 50, symbol: "Sn", name: "Tin", atomic_mass: 118.71, category: "Post-Transition Metal", group: 14, period: 5, density: 7.365, melting_point: 505.08, boiling_point: 2875 },
  
  // Period 6 (Selected)
  { atomic_number: 79, symbol: "Au", name: "Gold", atomic_mass: 196.97, category: "Transition Metal", group: 11, period: 6, density: 19.3, melting_point: 1337.33, boiling_point: 3243 },
  { atomic_number: 80, symbol: "Hg", name: "Mercury", atomic_mass: 200.59, category: "Transition Metal", group: 12, period: 6, density: 13.534, melting_point: 234.321, boiling_point: 629.88 },
  { atomic_number: 82, symbol: "Pb", name: "Lead", atomic_mass: 207.2, category: "Post-Transition Metal", group: 14, period: 6, density: 11.34, melting_point: 600.61, boiling_point: 2022 },
  
  // Period 7 (Selected)
  { atomic_number: 92, symbol: "U", name: "Uranium", atomic_mass: 238.03, category: "Actinide", group: null, period: 7, density: 19.1, melting_point: 1405.3, boiling_point: 4404 },
  { atomic_number: 94, symbol: "Pu", name: "Plutonium", atomic_mass: 244, category: "Actinide", group: null, period: 7, density: 19.816, melting_point: 912.5, boiling_point: 3505 }
];

/**
 * Searches the element library by name, symbol, or atomic number.
 */
export function searchElements(query: string): ChemicalElement[] {
  if (!query || query.trim() === '') return ELEMENT_LIBRARY;
  
  const normalizedQuery = query.toLowerCase().trim();

  return ELEMENT_LIBRARY.filter(element => {
    return (
      element.name.toLowerCase().includes(normalizedQuery) ||
      element.symbol.toLowerCase() === normalizedQuery ||
      element.atomic_number.toString() === normalizedQuery
    );
  });
}

/**
 * Generates a markdown block to insert the element properties into a document.
 */
export function getElementInsertText(element: ChemicalElement): string {
  let text = `\n### Element Profile: ${element.name} (${element.symbol})\n`;
  text += `- **Atomic Number**: ${element.atomic_number}\n`;
  text += `- **Atomic Mass**: ${element.atomic_mass} u\n`;
  text += `- **Category**: ${element.category}\n`;
  
  if (element.density) {
    text += `- **Density**: ${element.density} g/cm³\n`;
  }
  if (element.melting_point) {
    text += `- **Melting Point**: ${element.melting_point} K\n`;
  }
  if (element.boiling_point) {
    text += `- **Boiling Point**: ${element.boiling_point} K\n`;
  }
  
  return text + '\n';
}

/**
 * Maps element category to a tailwind base color for UI grid display.
 */
export function getElementCategoryColor(category: ElementCategory): string {
  switch (category) {
    case 'Alkali Metal': return 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30';
    case 'Alkaline Earth Metal': return 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30';
    case 'Transition Metal': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30';
    case 'Post-Transition Metal': return 'bg-lime-500/20 text-lime-300 border-lime-500/30 hover:bg-lime-500/30';
    case 'Metalloid': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30';
    case 'Reactive Nonmetal': return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30';
    case 'Noble Gas': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30';
    case 'Lanthanide': return 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30';
    case 'Actinide': return 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30';
    default: return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/30';
  }
}
