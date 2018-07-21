import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { SignUpComponent } from './sign-up.component';

xdescribe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ SignUpComponent ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should allow a user to sign up for an account', () => {
    let spy: jasmine.Spy = spyOn(router, 'navigateByUrl');
    let responseData = User.create({
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: '/media/photos/photo.png',
    });
    let photo: File = new File(['photo'], 'photo.jpg', {type: 'image/jpeg'});
    component.user = {
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      password: 'pAssw0rd!',
      group: 'rider',
      photo: photo
    };
    component.onSubmit();
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(responseData);
    expect(spy).toHaveBeenCalledWith('/log-in');
  });

});
