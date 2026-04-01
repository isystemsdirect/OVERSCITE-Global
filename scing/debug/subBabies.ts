import ENGINES from '../engineRegistry';

const LARI_SUB_ENGINES = Object.values(ENGINES).filter(e => e.family.includes('lari'));

export const SUB_BABIES = {
  lari: LARI_SUB_ENGINES,
};

export default SUB_BABIES;
