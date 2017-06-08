export interface CursorType {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  skip?: number;
  limit?: number;
  orderBy?: string | string[];
}