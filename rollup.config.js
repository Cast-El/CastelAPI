import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/castelApi.ts',
  output: [
    {
      file: 'dist/castelApi.js',
      format: 'es',
    },
    {
      file: 'dist/castelApi.cjs.js',
      format: 'cjs',
      exports: 'named'
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
    ],
    external: ['tslib'],
};
