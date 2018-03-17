export class User {
  constructor(
    public id?: number,
    public username?: string,
    public first_name?: string,
    public last_name?: string,
    public group?: string,
    public photo?: any
  ) {}
  static create(data: any): User {
    return new User(
      data.id,
      data.username,
      data.first_name,
      data.last_name,
      data.group,
      data.photo
    );
  }
  static getUser(): User {
    let userData: string = localStorage.getItem('taxi.user');
    if (userData) {
      return User.create(JSON.parse(userData));
    }
    return null;
  }
  static isRider(): boolean {
    let user: User = User.getUser();
    if (user === null) {
      return false;
    }
    return user.group === 'rider';
  }
}
