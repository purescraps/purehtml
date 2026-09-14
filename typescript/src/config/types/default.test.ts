import { describe, expect, it } from 'bun:test';
import { cheerio } from '../..';
import { Config, type ExtractParams } from '../config';
import DefaultValueConfig from './default';

class FakeConfig extends Config {
  constructor(private readonly val: unknown) {
    super();
  }

  extract(): unknown {
    return this.val;
  }
}

function fakeParams(): ExtractParams {
  const $ = cheerio.load('<div></div>');

  return { $, $el: $.root(), url: '', property: '' };
}

describe('DefaultValueConfig', () => {
  it('ReturnsDefaultWhenInnerResultIsNull', () => {
    const conf = DefaultValueConfig.generate(
      new FakeConfig(null),
      'unknown',
    );

    expect(conf.extract(fakeParams())).toBe('unknown');
  });

  it('ReturnsInnerResultWhenNotNull', () => {
    const conf = DefaultValueConfig.generate(
      new FakeConfig('actual value'),
      'unknown',
    );

    expect(conf.extract(fakeParams())).toBe('actual value');
  });

  it('PassesThroughFalsyNonNullValues', () => {
    expect(
      DefaultValueConfig.generate(new FakeConfig(0), 'unknown').extract(
        fakeParams(),
      ),
    ).toBe(0);
    expect(
      DefaultValueConfig.generate(new FakeConfig(''), 'unknown').extract(
        fakeParams(),
      ),
    ).toBe('');
    expect(
      DefaultValueConfig.generate(new FakeConfig(false), 'unknown').extract(
        fakeParams(),
      ),
    ).toBe(false);
  });
});
