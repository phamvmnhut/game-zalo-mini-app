export type ApiSearchResult<T> = {
  items: Array<T>;
  page: number;
  limit: number;
  totalItems: number;
  maxPage: number;
}
