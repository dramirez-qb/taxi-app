import { IsDriver } from './is-driver.service';

describe('IsDriver', () => {
  it('should allow a driver to access a route', () => {
    let isDriver: IsDriver = new IsDriver();
    localStorage.setItem('taxi.user', JSON.stringify({
      groups: ['driver']
    }));
    expect(isDriver.canActivate()).toBeTruthy();
  });
  it('should not allow a non-driver to access a route', () => {
    let isDriver: IsDriver = new IsDriver();
    localStorage.setItem('taxi.user', JSON.stringify({
      groups: ['rider']
    }));
    expect(isDriver.canActivate()).toBeFalsy();
  });
});
