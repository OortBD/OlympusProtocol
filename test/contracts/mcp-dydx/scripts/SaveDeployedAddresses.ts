import fs from 'fs';
import { promisify } from 'es6-promisify';
import mkdirp from 'mkdirp';
import contracts from './TestArtifacts';
import deployed from '../migrations/external-deployed.json';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(mkdirp);
console.log('synced...')

const NETWORK_IDS = ['HUYGENS'];

async function run() {
  const directory = `${__dirname}/../migrations/`;
  await mkdirAsync(directory);

  Object.keys(contracts).forEach((contractName) => {
    const contract = contracts[contractName];

    NETWORK_IDS.forEach((networkId) => {
      if (contract.networks['networkId']) {
        deployed[contractName] = deployed[contractName] || {};

        deployed[contractName][networkId] = {
          links: contract.networks[networkId].links,
          address: contract.networks[networkId].address,
          transactionHash: contract.networks[networkId].transactionHash,
        };
      }
    });
  });

  const json = JSON.stringify(deployed, null, 4) + '\n';

  const filename = 'external-deployed.json';
  await writeFileAsync(directory + filename, json, null);
  console.log(`Wrote ${filename}`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => process.exit(0));
