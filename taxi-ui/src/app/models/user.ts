export class User {
  constructor(
    public id?: number,
    public username?: string,
    public group?: string,
    public auth_token?: string
  ) {}
  static getUser(): User {
    let userData: string = localStorage.getItem('taxi.user');
    if (userData) {
      return <User>JSON.parse(userData);
    }
    return null;
  }
  static getGroup(): string {
    let user: User = User.getUser();
    if (user === null) {
      return null;
    }
    return user.group;
  }
  static isRider(): boolean {
    let user: User = User.getUser();
    if (user === null) {
      return false;
    }
    return user.group === 'rider';
  }
  static isDriver(): boolean {
    let user: User = User.getUser();
    if (user === null) {
      return false;
    }
    return user.group === 'driver';
  }
}
