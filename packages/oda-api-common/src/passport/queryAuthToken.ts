

export class Strategy {
  public name: string = 'authenticate-query-auth-token';
  // this will be overriden by passport
  private _verify;
  constructor(verify) {
    this._verify = verify;
  }
  public success(user, info?) {
    return;
  }
  public fail() {
    return;
  }
  public error(user, info?) {
    return;
  }
  public pass() {
    return;
  }
  public authenticate(req, res) {
    let token = req.query.authToken;
    if (token) {
      this._verify(token, (err, user) => {
        if (err) { return this.error(err); }
        if (user) {
          this.success(user);
        } else {
          this.fail();
        }
      });
    } else {
      this.fail();
    }
  }
}
