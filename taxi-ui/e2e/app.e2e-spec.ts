import { TaxiUiPage } from './app.po';

describe('taxi-ui App', () => {
  let page: TaxiUiPage;

  beforeEach(() => {
    page = new TaxiUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
