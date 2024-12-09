import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, join } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { cheerio, ConfigFactory, extract } from '../src';
import __dirname from './dirname.cjs';
import { validate } from 'jsonschema';

// This type comes from spec.schema.yaml at the root directory
interface PureHTMLTestSpec {
  description: string;
  specs: {
    configuration: unknown;
    description: string;
    expected: unknown;
    input: string; // html
  }[];
}

const specSchema = parseYaml(
  readFileSync(join(__dirname, '../../spec.schema.yaml')).toString()
);

const specsDir = join(__dirname, '../../specs');
const testSpecs: PureHTMLTestSpec[] = readSpecsDir(specsDir);

function readSpecsDir(dirPath: string): PureHTMLTestSpec[] {
  const result: PureHTMLTestSpec[] = [];
  const paths = readdirSync(dirPath);

  for (const path of paths) {
    const targetPath = join(dirPath, path);
    const stats = statSync(targetPath);

    if (stats.isDirectory()) {
      readSpecsDir(targetPath).forEach((subPath) => result.push(subPath));
    } else if (stats.isFile()) {
      const ext = extname(targetPath).toLowerCase();

      // ignore the file extensions other than yaml and yml
      if (ext === '.yaml' || ext === '.yml') {
        const spec = parseYaml(readFileSync(targetPath).toString());

        const validationResult = validate(spec, specSchema);

        if (validationResult.errors.length > 0) {
          console.error(`Invalid test spec found in file: ${targetPath}`);
          console.log('Errors:', validationResult.errors);

          throw new Error(
            `Cannot validate ${targetPath}. Check the yaml if it conforms spec.schema.yaml`
          );
        }

        result.push(spec as PureHTMLTestSpec);
      }
    } else {
      console.warn(`Unrecognized file: ${targetPath}`);
    }
  }

  return result;
}

// register spec files to the jest
testSpecs.forEach((spec) => {
  describe(spec.description, () => {
    spec.specs.forEach((testCase) => {
      test(testCase.description, () => {
        const config = ConfigFactory.fromYAML(
          stringifyYaml(testCase.configuration)
        );
        const result = extract(
          cheerio,
          testCase.input,
          config,
          'http://example.com'
        );

        expect(result).toEqual(testCase.expected);
      });
    });
  });
});
