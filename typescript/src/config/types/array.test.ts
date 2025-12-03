import { cheerio } from '../..';
import { type PrimitiveTypes, STRING } from '../../core/primitive-types';
import { rootProp } from '../../core/property';
import { Transformer, type TransformParams } from '../../core/transformer';
import type { ExtractParams } from '../config';
import { ArrayConfig } from './array';
import { PrimitiveValueConfig } from './primitive';

const html = `<div id="root">
  <div>foo</div>
  <div>bar</div>
  <div>baz</div>
</div>`;

class FakeTransformer extends Transformer {
  inputType(): PrimitiveTypes {
    return STRING;
  }

  outputType(): PrimitiveTypes {
    return STRING;
  }

  transform({ val }: TransformParams): unknown {
    return val;
  }
}

describe('array', () => {
  let params: ExtractParams;

  beforeAll(() => {
    const $ = cheerio.load(html);
    const $el = $.root();

    params = { $, $el, property: rootProp, url: 'https://example.com' };
  });

  it('should correctly set property', () => {
    const config = ArrayConfig.generate(
      '#root div',
      PrimitiveValueConfig.generate(null),
    );

    const result = config.extract(params);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  describe('transform', () => {
    it('should set "property" correctly', () => {
      const transfomer = new FakeTransformer();
      const spy = jest.spyOn(transfomer, 'transform');
      const config = ArrayConfig.generate(
        '#root div',
        PrimitiveValueConfig.generate(null, transfomer),
      );

      const property = 'some.nested.prop';
      const result = config.extract({ ...params, property });

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result).toEqual(['foo', 'bar', 'baz']);

      const baseParams = { ...params, $el: expect.anything() };

      expect(spy).toHaveBeenNthCalledWith(1, {
        ...baseParams,
        property: 'some.nested.prop[0]',
        val: 'foo',
      });
      expect(spy).toHaveBeenNthCalledWith(2, {
        ...baseParams,
        property: 'some.nested.prop[1]',
        val: 'bar',
      });
      expect(spy).toHaveBeenNthCalledWith(3, {
        ...baseParams,
        property: 'some.nested.prop[2]',
        val: 'baz',
      });
    });
  });
});
