export interface IUpdatable {
  updateWith(obj);
  toJS(): object;
}
