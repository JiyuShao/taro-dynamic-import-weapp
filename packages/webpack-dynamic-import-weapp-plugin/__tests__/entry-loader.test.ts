import EntryLoader from '../src/entry-loader';

describe('DynamicImportWeappPlugin entry-loader', () => {
  it('"entry-loader" should return prefix code', () => {
    expect(EntryLoader('script end')).toMatchSnapshot();
  });
});
