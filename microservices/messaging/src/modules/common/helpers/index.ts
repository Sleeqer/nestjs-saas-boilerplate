/**
 * Build a populate tree
 * @param {Array<string>} populate
 * @returns  {Array<object>}
 */
export const populate = (populate: Array<string>): Array<object> => {
  /**
   * Create a tree from dot notions
   * @param array
   */
  const tree = (array: Array<string>) =>
    array.reduce((trees: any, csv: any) => {
      csv
        .split('.')
        .reduce((obj: any, path: any) => (obj[path] = obj[path] || {}), trees);
      return trees;
    }, {});

  /**
   * Convert tree to parent children relations
   * @param {Array<string>} trees
   */
  const convert = (trees: Array<string>) =>
    Object.keys(trees).map((path) => {
      const object: any = { path };
      const populates = convert(trees[path]);
      if (populates.length) object.populate = populates;
      return object;
    });

  /**
   * Convertor
   */
  return convert(tree(populate));
};
