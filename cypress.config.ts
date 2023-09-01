import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '22j6d7',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
