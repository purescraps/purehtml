import { Example } from './example';

export const basic: Example[] = [
  {
    name: 'Simple',
    html: `<div>
  <span>
    Sample
  </span>
</div>`,
    config: `selector: div span
transform: trim
`,
  },
  {
    name: 'Attributes',
    html: `<div>
  <div data-foo="foo"></div>
  <div data-foo="bar"></div>
  <div data-foo="baz"></div>
</div>`,
    config: `selector: div[data-foo]
type: array # tip: try removing this line
items:
  transform: attr(data-foo)
`,
  },
];
