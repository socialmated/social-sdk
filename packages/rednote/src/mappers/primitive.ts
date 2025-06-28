function countToNumber(count?: string): number | undefined {
  if (!count) {
    return undefined;
  }
  if (count.endsWith('万')) {
    return parseFloat(count.slice(0, -1)) * 10000;
  }
  if (count.endsWith('+')) {
    return parseFloat(count.slice(0, -1)) + 1;
  }
  return parseFloat(count);
}

export { countToNumber };
