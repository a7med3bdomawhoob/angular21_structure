import { PaginationInfo } from "./pagination-info";

export class PaginatedList<T> {
  declare list: T[];
  declare paginationInfo: PaginationInfo;
}
