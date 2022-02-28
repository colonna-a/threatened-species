class Species {
  constructor(
    taxonid,
    kingdom_name,
    phylum_name,
    class_name,
    order_name,
    family_name,
    genus_name,
    scientific_name,
    taxonomic_authority,
    infra_rank,
    infra_name,
    population,
    category,
    main_common_name,
    title
  ) {
    this.taxonid = taxonid;
    this.kingdom_name = kingdom_name;
    this.phylum_name = phylum_name;
    this.class_name = class_name;
    this.order_name = order_name;
    this.family_name = family_name;
    this.genus_name = genus_name;
    this.scientific_name = scientific_name;
    this.taxonomic_authority = taxonomic_authority;
    this.infra_rank = infra_rank;
    this.infra_name = infra_name;
    this.population = population;
    this.category = category;
    this.main_common_name = main_common_name;
    this.title = title;
  }
}

const token =
  '9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';

export const getSpeciesByRegionList = async regionID => {
  try {
    const speciesByRegionResponse = await fetch(
      `https://apiv3.iucnredlist.org/api/v3/species/region/${regionID}/page/0?token=${token}`
    );
    const speciesByRegion = await speciesByRegionResponse.json();

    return speciesByRegion.result;
  } catch (error) {
    return error;
  }
};

export const getCriticalSpeciesByRegionList = async (regionID, speciesList) => {
  try {
    const speciesArray = await speciesList
      .filter(specie => specie.category === 'CR')
      .slice(0, 20) //limit
      .map(async specie => {
        const conservationMeasuresResponse = await fetch(
          `https://apiv3.iucnredlist.org/api/v3/measures/species/name/${specie.scientific_name}/region/${regionID}?token=${token}`
        );
        const conservationMeasures = await conservationMeasuresResponse.json();

        let titles = '';

        for (let i = 0; i < conservationMeasures.result.length; i++) {
          if (titles === '') {
            titles = conservationMeasures.result[i].title;
          } else titles = `${titles} - ${conservationMeasures.result[i].title}`;
        }

        return new Species(
          specie.taxonid,
          specie.kingdom_name,
          specie.phylum_name,
          specie.class_name,
          specie.order_name,
          specie.family_name,
          specie.genus_name,
          specie.scientific_name,
          specie.taxonomic_authority,
          specie.infra_rank,
          specie.infra_name,
          specie.population,
          specie.category,
          specie.main_common_name,
          titles
        );
      });

    const resolved = await Promise.all(speciesArray);

    return resolved;
  } catch (error) {
    return error;
  }
};

export const getMammalSpeciesByRegionList = async speciesList => {
  try {
    const speciesArray = speciesList
      .filter(specie => specie.class_name === 'MAMMALIA')
      .map(specie => {
        return new Species(
          specie.taxonid,
          specie.kingdom_name,
          specie.phylum_name,
          specie.class_name,
          specie.order_name,
          specie.family_name,
          specie.genus_name,
          specie.scientific_name,
          specie.taxonomic_authority,
          specie.infra_rank,
          specie.infra_name,
          specie.population,
          specie.category,
          specie.main_common_name,
          null
        );
      });

    return speciesArray;
  } catch (error) {
    return error;
  }
};
