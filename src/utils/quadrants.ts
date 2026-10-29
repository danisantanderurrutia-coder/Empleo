import type { CompanyDossier, QuadrantType } from '../types/companies';

export const inferCompanyQuadrants = (comp: CompanyDossier): QuadrantType[] => {
  if (comp.quadrants && comp.quadrants.length > 0) return comp.quadrants;
  const text = `${comp.name} ${comp.headquarters} ${comp.sector}`.toLowerCase();
  const quads: QuadrantType[] = [];
  if (
    text.includes('alemania') || 
    text.includes('germany') || 
    text.includes('kiel') || 
    text.includes('potsdam') || 
    text.includes('braunschweig') || 
    text.includes('leipzig') || 
    text.includes('dessau') || 
    text.includes('greifswald') || 
    text.includes('bremerhaven') || 
    text.includes('dach')
  ) {
    quads.push('DACH');
  }
  if (
    text.includes('bilbao') || 
    text.includes('bizkaia') || 
    text.includes('gipuzkoa') || 
    text.includes('donostia') || 
    text.includes('vitoria') || 
    text.includes('álava') || 
    text.includes('alava') || 
    text.includes('euskadi') || 
    text.includes('vasc') || 
    text.includes('derio') || 
    text.includes('zamudio') || 
    text.includes('arkaute') || 
    text.includes('leioa') || 
    text.includes('pasaia')
  ) {
    quads.push('EUSKADI');
  }
  if (
    text.includes('remoto') || 
    text.includes('remote') || 
    text.includes('internacional') || 
    text.includes('global') || 
    text.includes('mundial') || 
    text.includes('ue') || 
    text.includes('europa')
  ) {
    quads.push('GLOBAL');
  }
  return quads.length > 0 ? quads : ['GLOBAL'];
};
