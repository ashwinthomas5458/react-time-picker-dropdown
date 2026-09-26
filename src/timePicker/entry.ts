// Rollup entry. The stylesheet is imported here rather than in the component so
// the published .d.ts files never reference a .css file that is not shipped
// (TypeScript 6 reports unresolved side-effect imports by default).
import './timePicker.css';

export { default } from './index';
