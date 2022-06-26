# Configurable HTML to JSON converter
This tool aims to let you convert your HTMLs to structured JSONs.  
  
## API
Using this module is as simple as:  
  
```ts
import { ConfigFactory, extract } from 'configurable-html-parser';

const yaml = '...';
const html = '...';
const config = ConfigFactory.fromYAML(yaml);
const result = extract(html, config);
```
  
### `extract($: cheerio.Root | string, config: Config): any`
You may pass either `cheerio.Root` or `string` (html contents) to `extract` function.  
If you wish, you can use the same `cheerio.Root` for multiple configs without need to  
call `load(html)` again and again.  
  
## Configuration
* `selector` is **required** in all configurations and **must** not be empty.  
* `type` can be `string`, `object` and `array` **explicitly**.
* `type` might become `number`, `boolean`, `object` and `array` **implicitly** by the `transform` parameter.
* `transform` can be either:
  - name of one of the core transformers. see `Core Transformers` section below.
  - [not available for YAML] an instance of a class that extends `Transformer` class.
  - array of above
* `properties: { [key: string]: Config }` implicitly sets `type` to `object`.
* `items: Config` defines the configuration that will be used to extract data for every match of the selector.
