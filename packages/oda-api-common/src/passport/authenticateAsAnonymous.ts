import Anonymous from './userAnonymous';

export class Strategy {
  public name: string = 'authenticate-as-anonymous';
  // this will be overriden by passport
  public success(user, info?) {
    return;
  }
  public authenticate() {
    this.success(Anonymous());
  }
}
