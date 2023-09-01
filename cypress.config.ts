import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '22j6d7',
  component: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
