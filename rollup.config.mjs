import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

// dist/index.js keeps the 1.0.x CommonJS shape, where require() returns the
// component itself, and also exposes it as `.default`. The entry types use
// `export =` to describe that shape, which tsc cannot emit from ES module
// source, so they are written here. The .d.ts files they import are emitted
// by `tsc -p tsconfig.build.json`.
const ENTRY_TYPES = `import _TimePicker, { type TimePickerProps as _TimePickerProps } from './timePicker';
declare const TimePicker: typeof _TimePicker & { default: typeof _TimePicker };
declare namespace TimePicker {
  type TimePickerProps = _TimePickerProps;
}
export = TimePicker;
`;

const entryTypes = () => ({
  name: 'entry-types',
  generateBundle(options) {
    if (options.format === 'cjs') {
      this.emitFile({ type: 'asset', fileName: 'index.d.ts', source: ENTRY_TYPES });
    }
  },
});

export default [
  {
    input: './src/timePicker/entry.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'default',
        footer: 'module.exports.default = module.exports;',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      }
    ],
    external: ['react', 'react/jsx-runtime'],
    plugins: [
      postcss({
        plugins: [],
        minimize: true,
      }),
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        noEmit: false,
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
      }),
      // Added through terser because it strips output.banner. Marks the
      // component as a client component for React Server Components.
      terser({ format: { preamble: "'use client';" } }),
      entryTypes(),
    ]
  }
];
