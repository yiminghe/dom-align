import { defineConfig } from 'cypress';
import codeCoverage from '@cypress/code-coverage/task';
export default defineConfig({
  projectId: '22j6d7',
  component: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config)
      return config;
    },
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
