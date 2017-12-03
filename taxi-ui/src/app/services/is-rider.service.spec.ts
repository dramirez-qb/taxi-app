import { IsRider } from './is-rider.service';

describe('IsRider', () => {
  it('should allow a rider to access a route', () => {
    let isRider: IsRider = new IsRider();
    localStorage.setItem('taxi.user', JSON.stringify({
      groups: ['rider']
    }));
    expect(isRider.canActivate()).toBeTruthy();
  });
  it('should not allow a non-rider to access a route', () => {
    let isRider: IsRider = new IsRider();
    localStorage.setItem('taxi.user', JSON.stringify({
      groups: ['driver']
    }));
    expect(isRider.canActivate()).toBeFalsy();
  });
});
