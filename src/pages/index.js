import React, { useState, useEffect } from 'react';
import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiPanel,
  EuiText,
  EuiButton,
  EuiInMemoryTable,
  EuiLoadingSpinner,
} from '@elastic/eui';
import {
  getSpeciesByRegionList,
  getCriticalSpeciesByRegionList,
  getMammalSpeciesByRegionList,
} from '../components/api';

const Index = ({ regions }) => {
  const [randomRegion, setRandomRegion] = useState('');
  const [speciesByRegion, setSpeciesByRegion] = useState([]);
  const [mammalSpeciesByRegion, setMammalSpeciesByRegion] = useState([]);

  useEffect(() => {
    if (randomRegion) {
      getSpeciesByRegionList(randomRegion.identifier).then(speciesRetrieved => {
        getMammalSpeciesByRegionList(speciesRetrieved).then(mammalSpecies =>
          setMammalSpeciesByRegion(mammalSpecies)
        );
        getCriticalSpeciesByRegionList(
          randomRegion.identifier,
          speciesRetrieved
        ).then(criticalSpecies => setSpeciesByRegion(criticalSpecies));
      });
    }
  }, [randomRegion]);

  const getRandomRegion = async () => {
    setSpeciesByRegion([]);
    setRandomRegion(
      regions.results[Math.floor(Math.random() * regions.results.length)]
    );
  };

  const columns = [
    {
      name: 'Kingdom name',
      field: 'kingdom_name',
      sortable: true,
    },
    {
      name: 'Phylum name',
      field: 'phylum_name',
      sortable: true,
    },
    {
      name: 'Class name',
      field: 'class_name',
      sortable: true,
    },
    {
      name: 'Family name',
      field: 'family_name',
      sortable: true,
    },
    {
      name: 'Scientific name',
      field: 'scientific_name',
      sortable: true,
    },
    {
      name: 'Title',
      field: 'title',
    },
    {
      name: 'Category',
      field: 'category',
    },
  ];

  return (
    <>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={1}>
          <EuiText color="danger">
            <h1 className="title">Threatened Species</h1>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />

      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={1}>
          <EuiText textAlign="center">
            <p>Available regions for species</p>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGrid>
        {regions.results.map(item => {
          return (
            <EuiFlexItem grow={1} key={item.identifier}>
              <EuiPanel hasBorder={false}>
                <EuiText textAlign="center">{item.name}</EuiText>
              </EuiPanel>
            </EuiFlexItem>
          );
        })}
      </EuiFlexGrid>

      <EuiSpacer size="xxl" />
      <EuiFlexGroup alignItems="center" justifyContent="center">
        <EuiFlexItem grow={false}>
          <EuiSpacer size="xxl" />
          <EuiButton color="danger" fill onClick={() => getRandomRegion()}>
            Random region
          </EuiButton>
          <EuiSpacer size="l" />
          <EuiText textAlign="center">{randomRegion.name}</EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="xxl" />
      <EuiFlexGroup alignItems="center" justifyContent="center">
        <EuiFlexItem grow={false}>
          <EuiText textAlign="center">
            <b>List of threatened species in the selected region</b>
          </EuiText>
          <EuiSpacer size="l" />
          <EuiInMemoryTable
            id="table-speciesByRegion"
            columns={columns}
            items={speciesByRegion}
            pagination={true}
            sorting={{ sort: { field: 'genus_name', direction: 'asc' } }}
            responsive={true}
            message={
              randomRegion && speciesByRegion.length == 0 ? (
                <EuiLoadingSpinner size="xl" />
              ) : (
                'No selected region'
              )
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="xxl" />
      <EuiFlexGroup alignItems="center" justifyContent="center">
        <EuiFlexItem grow={false}>
          <EuiText textAlign="center">
            <b>List of mammal class in the selected region</b>
          </EuiText>
          <EuiSpacer size="xxl" />
          <EuiInMemoryTable
            id="table-mammalClass"
            columns={columns}
            items={mammalSpeciesByRegion}
            pagination={true}
            sorting={{ sort: { field: 'genus_name', direction: 'asc' } }}
            responsive={true}
            message="No mammal found in selected region"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
export default Index;

export async function getStaticProps() {
  const regionResponse = await fetch(
    'https://apiv3.iucnredlist.org/api/v3/region/list?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee'
  );
  const regions = await regionResponse.json();

  return {
    props: {
      regions,
    },
  };
}
