function paginateData(page: number = 0, data: any[]) {
  const PAGE_SIZE = 20;
  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return data.slice(startIndex, endIndex);
}

export { paginateData };
