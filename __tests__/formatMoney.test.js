import formatMoney from '../lib/formatMoney';

describe('format money function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toBe('$0.01');
    expect(formatMoney(10)).toBe('$0.10');
    expect(formatMoney(9)).toBe('$0.09');
    expect(formatMoney(40)).toBe('$0.40');
  });

  it('leaves off cents with whole dollars', () => {
    expect(formatMoney(100)).toBe('$1');
    expect(formatMoney(5000)).toBe('$50');
    expect(formatMoney(50000000)).toBe('$500,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(140)).toBe('$1.40');
    expect(formatMoney(5012)).toBe('$50.12');
    expect(formatMoney(101)).toBe('$1.01');
    expect(formatMoney(3423987423946)).toBe('$34,239,874,239.46');
  });
});
