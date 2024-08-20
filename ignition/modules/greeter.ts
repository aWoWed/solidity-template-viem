import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'Greeter';
const GREETING = 'Hello there!';

const GreeterModule = buildModule(NAME, (module) => {
  const greeting = module.getParameter('greeting', GREETING);
  const greeter = module.contract(NAME, artifacts.readArtifactSync(NAME), [
    greeting,
  ]);

  return { greeter };
});

export default GreeterModule;
