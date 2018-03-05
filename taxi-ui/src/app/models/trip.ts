import { User } from './user';

export class Trip {
  static create(data: any): Trip {
    return new Trip(
      data.id,
      data.nk,
      data.created,
      data.updated,
      data.pick_up_address,
      data.drop_off_address,
      data.status,
      data.driver ? User.create(data.driver) : null,
      User.create(data.rider)
    );
  }
  public otherUser: User;
  constructor(
    public id?: number,
    public nk?: string,
    public created?: string,
    public updated?: string,
    public pick_up_address?: string,
    public drop_off_address?: string,
    public status?: string,
    public driver?: any,
    public rider?: any
  ) {
    this.otherUser = User.isRider() ? this.driver : this.rider;
  }
}
