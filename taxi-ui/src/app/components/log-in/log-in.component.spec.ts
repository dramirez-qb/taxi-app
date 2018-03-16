import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth.service';
import { LogInComponent } from '../log-in/log-in.component';

xdescribe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ LogInComponent ],
      providers: [ AuthService ]
    });
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
  });

  it('should allow a user to log into an existing account', () => {
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      group: 'rider',
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    };
    component.user = {username: 'rider@example.com', password: 'pAssw0rd!'};
    component.onSubmit();
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toEqual(JSON.stringify(responseData));
  });

  afterEach(() => {
    httpMock.verify();
  });
});
