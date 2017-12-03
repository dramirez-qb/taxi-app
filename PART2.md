# Uber App Using Django Channels (Part 2)

In the first part of this tutorial, we designed, tested, and programmed the server code for our taxi app. Part 2 is all about the user interface. We'll be following the same test-driven development pattern to develop the front-end code that we did for the back-end. We'll also be programming the components in roughly the same order, starting with authentication. 

Our client-side application uses:
- NodeJS (v8.2.1)
- Bower (v1.8.0)
- Jasmine (v2.6)
- Karma (v1.0)
- AngularJS (v1.6.5)

## Getting Started

TODO: Use _yarn_ instead of _bower_...

```bash
$ brew update
$ brew install node
$ npm install -g bower karma-cli
$ npm install karma karma-chrome-launcher karma-jasmine jasmine-core --save-dev
$ bower init
$ bower install angular#1.6.5 angular-ui-router#1.0.5 bootstrap#3.3.7 bootswatch#3.3.7 --save
$ bower install angular-mocks#1.6.5 --save-dev
```

As a first step, let's create the basic structure of our HTML. In the example below, I've included all of the stylesheet and script files that we will need to load in. Take note of the tags surrounded by `{% %}`. These are Django template tags and are necessary to integrate our HTML into our Django app. The `{% load staticfiles %}` does ___. The `{% static %}` tag allows the Django app to retrieve a file from the static files directory. Everything between the `{% verbatim %}{% endverbatim %}` tags will be rendered exactly how it is written. This is important because the Django template engine also uses the same tagging syntax, `{{ }}` as AngularJS.

Another important thing to note is the presence of the `ng-app="taxi"` attribute on the `<html>` tag. Together with the `angular.module()` code in our _app.js_ file, this tag links our HTML template to the AngularJS module.

**www/app/src/index.html**

```html
{% load staticfiles %}
<!DOCTYPE html>
<html lang="en" ng-app="taxi">
<head>
  <meta charset="utf-8">
  <title>Taxi</title>
  <link rel="stylesheet" href="{% static 'bower_components/bootswatch/lumen/bootstrap.min.css' %}">
  <link rel="stylesheet" href="{% static 'app/src/app.css' %}">
</head>
<body>
  {% verbatim %}
  <div class="container">
    <div class="middle-center">
      <h1 class="landing logo">Taxi</h1>
		</div>
	</div>
  {% endverbatim %}
  <script src="{% static 'bower_components/jquery/dist/jquery.min.js' %}"></script>
  <script src="{% static 'bower_components/bootstrap/dist/js/bootstrap.min.js' %}"></script>
  <script src="{% static 'bower_components/angular/angular.min.js' %}"></script>
	<script src="{% static 'bower_components/angular-ui-router/release/angular-ui-router.min.js' %}"></script>
  <script src="{% static 'app/src/app.js' %}"></script>
</body>
</html>
```

**www/app/src/app.css**

```css
@import url(https://fonts.googleapis.com/css?family=Patua+One);

.logo {
  font-family: "Patua One", sans-serif;
  font-weight: 400;
}

.landing {
  font-size: 72px;
}

.middle-center {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  margin: auto auto;
  position: absolute;
  text-align: center;
}
```

**www/app/src/app.js**

```js
// Initializes our AngularJS app.
angular.module('taxi', []);
```

Since we are declaring a folder that is not in the Python path to hold our static files and templates, we need to explicitly tell Django where to find them.

**example_taxi/settings.py**

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'www'),
        ],
        'APP_DIRS': False,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'www'),
)
```

Lastly, we need to add our _index.html_ file so that we load it when a user hits the site.

**example_taxi/urls.py**

```python
from django.conf.urls import include, url
from django.views.generic import TemplateView
from trip.apis import SignUpView, LogInView, LogOutView

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app/src/index.html')),
    url(r'^api/trip/', include('trip.urls', namespace='trip')),
    url(r'^api/sign_up/$', SignUpView.as_view(), name='sign_up'),
    url(r'^api/log_in/$', LogInView.as_view(), name='log_in'),
    url(r'^api/log_out/$', LogOutView.as_view(), name='log_out'),
]
```

## Authentication

Talk about Karma and Jasmine...

```bash
$ karma init karma.conf.js
```

Why are we loading these files here?

**www/karma.conf.js**

```js
files: [
	'./bower_components/angular/angular.js',
	'./bower_components/angular-ui-router/release/angular-ui-router.min.js',
	'./app/src/app.js',
	'./bower_components/angular-mocks/angular-mocks.js',
	'./test/authentication-spec.js'
]
```

Talk about the listener that will make Karma run fresh every time a file is changed.

```bash
$ karma start
```

## Jasmine for Python Developers

Jasmine is a JavaScript testing framework that is recommended by the AngularJS documentation. Throughout this tutorial, we will be writing our tests using the Jasmine API. Before we write our first test, let's take a look at some important Jasmine components and see how they match up with their Django counterparts.

**Basic Django Test**

```python
class AuthenticationTest(TestCase):
    def setUp(self): pass
    def test_user_can_sign_up_for_an_account(self): pass
    def tearDown(self): pass
```

**Basic Jasmine Test**

```js
describe('Authentication', function () {
  beforeEach(function() {});
  it('should allow a user to sign up for an account', function () {});
  afterEach(function () {});
});
```

In Jasmine, you define a collection of tests using the `describe()` function. The `beforeEach()` and `afterEach()` functions are Jasmine's versions of Django's `setUp()` and `tearDown()` functions, respectively. Whereas in Django you define a testable function with the `test_` prefix, in Jasmine you use the `it()` function. The intention is that Jasmine tests should read somewhat like a sentence. "Describe authentication. It should allow a user to sign up for an account."

Let's write our first front-end test.

**www/test/authentication-spec.js**

```js
describe('Authentication', function () {
  var $http, $httpBackend;

  beforeEach(angular.mock.module('taxi'));

  beforeEach(inject(function (_$http_, _$httpBackend_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
  }));

  it('should allow a user to sign up for an account', function () {
    var response;

    $httpBackend.expectPOST('http://localhost:8000/api/sign_up/').respond(201, {
      'id': 1,
      'username': 'rider@example.com',
      'groups': ['rider']
    });

    $http.post('http://localhost:8000/api/sign_up/', {
      'username': 'rider@example.com',
      'password1': 'pAssw0rd!',
      'password2': 'pAssw0rd!'
    }).then(function (httpResponse) {
      response = httpResponse;
    });

    $httpBackend.flush();
    
    expect(response.status).toEqual(201);
    expect(response.data).toEqual({
      'id': 1,
      'username': 'rider@example.com',
      'groups': ['rider']
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
```

TODO: Add the base url as either an enviroment variable or a constant - http://localhost:8000

This is a lot of code to throw up on the screen at once, so let's step through each part of the test. We start off by creating a collection of "Authentication" tests. Before each test function, we want to load our Angular module, _taxi_. We also want access to two built-in Angular services, `$http` and `$httpBackend`. The `$http` service gives us the ability to make asynchronous requests to the server. During a test run, we don't have access to a real backend, so the `$httpBackend` provides a fake one for us. We use the `inject()` function to import these modules and save them to local variables, so that we can use them in our tests. The Angular developers guessed that we would probably want to name our local variables the same as the modules we are would be importing, so they let us identify the modules with underscores as a convenience. After each test function, we run some code to verify that we sent requests to all of the APIs that we planned on hitting and that our backend processed all of those requests.

The test function itself is fairly straightforward. We tell our backend to expect an HTTP POST request for the _/sign_up/_ API endpoint. When the request is received, the backend should return a response containing new user data. Next, we actually create the request and send it. Remember, our backend is expecting us to sign up with a username and a password. Then, we flush the backend to manually process the asynchronous request, at which point we capture the response to a local variable. Lastly, we declare two assertions to confirm that the response status code and the response data that are returned are what we expected. If you take a look at Karma, you'll see that the test is passing!

This is a pretty nice looking test, but defining the `$http.post()` within the test doesn't do us any good in the real world. We need to move that functionality to a service that we can access from anywhere in our code. Let's refactor our test to use an `authentication` service that we will create.

**www/test/authentication-spec.js**

```js
describe('Authentication test', function () {
	var $httpBackend;
	var authentication;

	beforeEach(angular.mock.module('taxi'));

	beforeEach(inject(function (_$httpBackend_, _authentication_) {
		$httpBackend = _$httpBackend_;
		authentication = _authentication_;
	}));

	it('should allow a user to sign up', function() {
    var response;
    var responseData = {
      'id': 1,
      'username': 'rider@example.com',
      'groups': ['rider']
    };

		$httpBackend.expectPOST('http://localhost:8000/api/sign_up/').respond(201, responseData);

    authentication.signUp('rider@example.com', 'pAssw0rd!', 'rider').then(function (httpResponse) {
      response = httpResponse;
    });

    $httpBackend.flush();

    expect(response.status).toEqual(201);
		expect(response).toEqual(responseData);
	});

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
```

Let's examine what we replaced in our test. We swapped the built-in `$http` service for an `authentication` service that we are going to build ourselves. We also defined a `signUp()` function on our `authentication` service that takes a _username_, a _password_, and a _group_ as parameters. We leveraged a `responseData` variable to avoid repeating ourselves, but other than those changes, the test is functionally the same.

When we glance at our Karma runner, we see that our tests are failing. Let's create the `authentication` service to get our tests to pass.

**www/app/src/app.js**

```js
function authentication($http, $q) {
	this.signUp = function signUp(username, password, group) {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/sign_up/', {
			username: username,
			password1: password,
			password2: password,
			group: group
		}).then(function (httpResponse) {
			deferred.resolve(httpResponse.data);
		}, function (httpResponse) {
			deferred.reject(httpResponse.data);
		});
		return deferred.promise;
	};
}

angular.module('taxi', [])
	.service('authentication', ['$http', '$q', authentication]);
```

TODO: $q is not neceesarry since promises are build into es6. `defer` is a bit of an anti pattern

Our `authentication` service defines a single `signUp()` function, and it requires two Angular services to be injected (imported). Remember, we use the `$http` service to make asynchronous requests to the server. The time that it takes the server to process the request and return a response can vary based on several factors. Given this fact, we don't want to return the result of a request that hasn't finished processing. We can use the `$q` service to return a _promise_ that is guaranteed to process a response once it is returned by the server.

The `signUp()` function takes a _username_, a _password_, and a _group_ parameter as we defined in our test. It hits the _/sign_up/_ API endpoint using the `$http` service just like our previous test did. If the request is successful, our function resolves the promise and passes the response data to whatever object is waiting for it. If the request fails, then the promise is rejected.

With our new service and function in place, check the Karma tests to confirm that they pass.

Using the same steps, let's create and test the _log in_ and _log out_ authentication functionality.

**www/test/authentication-spec.js**

```js
it('should allow a user to log in', function () {
  var response;
  var responseData = {
		'id': 1,
		'username': 'rider@example.com',
		'groups': ['rider'],
		'auth_token': '2df504b532e39a49e05b08b8ba718f7a327b8f76'
	};

	$httpBackend.expectPOST('http://localhost:8000/api/log_in/').respond(200, responseData);

	authentication.logIn('rider@example.com', 'pAssw0rd!').then(function (httpResponse) {
    response = httpResponse;
  });

	$httpBackend.flush();

  expect(response.status).toEqual(200);
	expect(response.data).toEqual(responseData);
});
```

**www/app/src/app.js**

```js
function authentication($http, $q) {
	this.logIn = function logIn(username, password) {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/log_in/', {
			username: username,
			password: password
		}).then(function (httpResponse) {
			deferred.resolve(httpResponse.data);
		}, function (httpResponse) {
			deferred.reject(httpResponse.data);
		});
		return deferred.promise;
	};
}
```

Our `logIn()` function requires a _username_ and a _password_ parameter. The server should return the logged-in user data along with an authorization token to be used in subsequent requests.

**www/test/authentication-spec.js**

```js
it('should allow a user to log out', function () {
  var response;
  var responseData = {};
  var token = '2df504b532e39a49e05b08b8ba718f7a327b8f76';

	$httpBackend.expectPOST('http://localhost:8000/api/log_out/').respond(204, responseData);

	authentication.logOut(token).then(function (httpResponse) {
    response = httpResponse;
  });

	$httpBackend.flush();

  expect(response.status).toEqual(204);
	expect(response.data).toEqual(responseData);
});
```

**www/app/src/app.js**

```js
function authentication($http, $q) {
	this.logOut = function logOut(token) {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/log_out/', null, {
			headers: {
				Authorization: 'Token ' + token
			}
		}).finally(function (httpResponse) {
			deferred.resolve({});
		});
		return deferred.promise;
	};
}
```

Our `logOut()` function requires the authorization token that we received when we logged in. Remember, our Python code requires authentication to access the _/log_out/_ API endpoint. We pass the authorization token as a header in our request and the server returns an empty, successful response.

## Our First Views

Up until this point, we have coded a lot of functionality, but we haven't actually _seen_ anything working. We really need a UI that we can interact with and experience to bring some life to our app. When it comes to the look and feel of our app, I'm just going to make it look good without explaining how I did it. I'll leave the exploration of CSS and UI libraries as an exercise that you can do outside of this tutorial. Just know that we are using Bootstrap as our UI library along with a Bootswatch theme to make it look less generic. Let's create our first views.

**www/app/src/landing.html**

```html
<div class="middle-center">
  <h1 class="landing logo">Taxi</h1>
  <a class="btn btn-primary" href ui-sref="log_in">Log in</a>
  <a class="btn btn-primary" href ui-sref="sign_up">Sign up</a>
  <button class="btn btn-primary" type="button">Log out</a>
</div>
```

This view will show when the user visits the home page. This is the default view.

**www/app/src/sign-up.html**

```html
<div class="row">
  <div class="col-lg-offset-4 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">Sign up</h4>
      </div>
      <div class="panel-body">
        <form novalidate>
          <div class="form-group">
            <label>Username:</label>
            <input class="form-control" type="text">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input class="form-control" type="password">
          </div>
          <div class="form-group">
            <label>Password (again):</label>
            <input class="form-control" type="password">
          </div>
          <div class="form-group">
            <label>Group:</label>
            <select class="form-control" name="group">
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Sign up</button>
        </form>
      </div>
    </div>
    <p class="text-center">Already have an account? <a href ui-sref="log_in">Log in!</a></p>
  </div>
</div>
```

This is the form that the user will use to sign up for a new account.

**www/app/src/log-in.html**

```html
<div class="row">
  <div class="col-lg-offset-4 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">Log in</h4>
      </div>
      <div class="panel-body">
        <form novalidate>
          <div class="form-group">
            <label>Username:</label>
            <input class="form-control" type="text">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input class="form-control" type="password">
          </div>
          <button class="btn btn-primary btn-block" type="submit">Log in</button>
        </form>
      </div>
    </div>
    <p class="text-center">Don't have an account? <a href ui-sref="sign_up">Sign up!</a></p>
  </div>
</div>
```

This is the form that the user will use to log in to an existing account.

Our app is a single page application, meaning that the browser only makes one synchronous request to the backend (to load the main HTML) and then all subsequent requests are made asynchronously. As each request resolves, the UI processes the data and changes the views appropriately. _UI-Router_ is a third-party Angular library that makes switching page views very simple. The following code details how to configure routing.

**www/app/src/app.js**

```js
function RouterConfig($stateProvider, $urlRouterProvider) {
	$stateProvider.state('landing', {
		url: '/',
		templateUrl: '/static/app/src/landing.html',
		controller: 'LandingController',
		controllerAs: 'vm'
	});

	$stateProvider.state('sign_up', {
		url: '/sign_up',
		templateUrl: '/static/app/src/sign-up.html',
		controller: 'SignUpController',
		controllerAs: 'vm'
	});

	$stateProvider.state('log_in', {
		url: '/log_in',
		templateUrl: '/static/app/src/log-in.html',
		controller: 'LogInController',
		controllerAs: 'vm'
	});

	$urlRouterProvider.otherwise('/');
}

function LandingController() {}

function SignUpController() {}

function LogInController() {}

angular.module('taxi', ['ui.router'])
	.service('authentication', ['$http', '$q', authentication])
	.config(['$stateProvider', '$urlRouterProvider', RouterConfig])
  .controller('LandingController', [LandingController])
  .controller('SignUpController', [SignUpController])
  .controller('LogInController', [LogInController]);
```

We start by creating a `RouterConfig` configuration. We inject two services, `$stateProvider` and `$urlRouterProvider`, that are defined by _UI-Router_. The `$stateProvider` service is a global object that holds the registered states of the application. Each `state()` function maps a state definition to a name. A state definition includes a URL path, an HTML template to display when the URL path is visited, and a `controller()`. _Controllers_ are Angular objects that provide functionality to HTML templates via special attributes. We will look at _controllers_ more closely in the next section. We use the `$urlRouterProvider` service to configure the default state of the application. One more thing to note is that we have added a new `ui.router` module to be loaded by our main `taxi` module. Adding the `ui.router` module makes all of the _UI-Router_ API elements available to our app.

**www/app/src/index.html**

```html
{% load staticfiles %}
<!DOCTYPE html>
<html lang="en" ng-app="taxi">
<head>
  <meta charset="utf-8">
  <title>Taxi</title>
  <link rel="stylesheet" href="{% static 'bower_components/bootswatch/lumen/bootstrap.min.css' %}">
  <link rel="stylesheet" href="{% static 'app/src/app.css' %}">
</head>
<body>
  {% verbatim %}
  <div class="container" ui-view></div>
  {% endverbatim %}
  <script src="{% static 'bower_components/jquery/dist/jquery.min.js' %}"></script>
  <script src="{% static 'bower_components/bootstrap/dist/js/bootstrap.min.js' %}"></script>
  <script src="{% static 'bower_components/angular/angular.min.js' %}"></script>
	<script src="{% static 'bower_components/angular-ui-router/release/angular-ui-router.min.js' %}"></script>
  <script src="{% static 'app/src/app.js' %}"></script>
</body>
</html>

```

For our last step, we need to add the `ui-view` directive to our main HTML file. Every page view will be added as a child of this `<div ui-view></div>` element. Run the app and visit the homepage. You should see a landing page with three buttons labelled _Sign up_, _Log in_ and _Log out_. Click on the different buttons to navigate across the different views.

## Moving Authentication to the Controllers

In the last two sections, we learned how to create a custom `authentication` service and we learned how to create navigable page views. In this section, we will learn how to marry the two together, in order to add functionality to our UI controls. 

First, let's refactor our tests to use controllers.

**www/test/authentication-spec.js**

```js
describe('Authentication', function () {
	var $controller, $httpBackend;
	var authentication;

	beforeEach(angular.mock.module('taxi'));

	beforeEach(inject(function (_$controller_, _$httpBackend_, _authentication_) {
    $controller = _$controller_;
		$httpBackend = _$httpBackend_;
		authentication = _authentication_;
	}));

	it('should allow a user to sign up for an account', function() {
    var SignUpController = $controller('SignUpController');
    // var response;
    var responseData = {
      'id': 1,
      'username': 'rider@example.com',
      'groups': ['rider']
    };

		$httpBackend.expectPOST('http://localhost:8000/api/sign_up/').respond(201, responseData);

    spyOn(authentication, 'signUp').and.callThrough();

    SignUpController.form = {
      'username': 'rider@example.com',
      'password1': 'pAssw0rd!',
      'password2': 'pAssw0rd!',
      'group': 'rider'
    }
    SignUpController.submit();

    $httpBackend.flush();

    expect(authentication.signUp).toHaveBeenCalledWith('rider@example.com', 'pAssw0rd!', 'rider');
    // expect(response.status).toEqual(201);
		// expect(response.data).toEqual(responseData);
	});
});
```

First, we add the `$controller` service and use it to load the `SignUpController` into our test. Next, we anticipate the form data that we need to be collected based on the sign up form that we created in a previous step. We patch that form data onto the `SignUpController` instance and then we run the `submit()` function to submit the form data to the backend. After we make our changes, submitting form data should accomplish the same thing as calling the `authentication` service directly. Finally, we want to ensure that our `authentication` service is still being called (via the controller), so we add a _spy_ with a `callThrough()` function that allows us to execute the `authentication.signUp()` function while recording any calls made to it.

You should notice something off about this code. Now that we are using a controller instead of our `authentication` service to sign up a user, we lose the ability to capture the response returned by the server. Don't worry, we will double back in a bit to address this issue, but first let's fix our failing tests.

**www/app/src/app.js**

```js
function SignUpController($state, authentication) {
	var vm = this;

	vm.form = {
		username: '',
		password1: '',
		password2: '',
		group: ''
	};

	vm.isFormInvalid = function isFormInvalid() {
		return vm.form.$invalid || vm.form.password1.length === 0 || vm.form.password1 !== vm.form.password2;
	};

	vm.submit = function submit() {
		authentication.signUp(vm.form.username, vm.form.password1, vm.form.group).then(function () {
			$state.go('landing');
		}, function () {
			vm.form = {
				username: '',
				password1: '',
				password2: ''
			};
		});
	};
}

angular.module('taxi', ['ui.router'])
  // Others hidden for clarity...
	.controller('SignUpController', ['$state', 'authentication', SignUpController]);
```

We start by adding data and functionality to the `SignUpController`. We inject our `authentication` service along with a _UI-Router_ service, `$state`, which allows us to explicitly set the current page view. We create a `form` object to hold the data that we collect through our sign up form. We also create a helper `isFormInvalid()` function to toggle the submit button's enabled state. If the form is invalid, we don't want the user to be allowed to send bad or incomplete data. Lastly, we add our `submit()` function, which leverages the `authentication` service to send the user data to the _/sign_up/_ API. If the request succeeds, then we navigate back to the landing page, and if it fails, then we clear the form.

After we implement these changes, our tests should pass.

Next, let's get the UI working.

**www/app/src/sign-up.html**

```html
<div class="row">
  <div class="col-lg-offset-4 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">Sign up</h4>
      </div>
      <div class="panel-body">
        <form novalidate ng-submit="vm.submit()">
          <div class="form-group">
            <label>Username:</label>
            <input class="form-control" type="text" ng-model="vm.form.username" required>
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input class="form-control" type="password" ng-model="vm.form.password1" required>
          </div>
          <div class="form-group">
            <label>Password (again):</label>
            <input class="form-control" type="password" ng-model="vm.form.password2" required>
          </div>
          <div class="form-group">
            <label>Group:</label>
            <select class="form-control" name="group" ng-model="vm.form.group" required>
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <button class="btn btn-primary btn-block" type="submit" ng-disabled="vm.isFormInvalid()">Sign up</button>
        </form>
      </div>
    </div>
    <p class="text-center">Already have an account? <a href ui-sref="log_in">Log in!</a></p>
  </div>
</div>
```

Now that we have configured the controller, we can add functionality to the sign up form. Starting from the top, we add the `ng-submit` directive to the `<form>` tag and link it to the `submit()` function that we defined in our controller. The `ng-submit` directive binds the `submit()` function to the `onsubmit` JavaScript event that fires when the form is submitted. When we click our submit button, the controller's `submit()` function will be called.

Next, we add the `ng-model` directive to each form control element, which binds it to a property in the controller. Using `ng-model` sets up a two-way binding, which means that any time the user changes the value of the form control, the value of the property will change, and the opposite is also true. If anything else changes the property linked to the control, the value of the control will change to reflect the new property value. 

Lastly, we add the `required` HTML attribute to each form control and we add the `ng-disabled` directive to the submit button. Remember, we programmed a `isFormInvalid()` function on our controller to check the validity of our form. If any of the fields marked with `required` are empty, our form will not validate. When the form if invalid, we want to prevent the user from being able to submit incomplete data, so we disable the submit button.

Try to use the form after you implement the template changes. You should be able to create a new user!

I promised that we would revisit the sign up test, and the following section describes how to fix it.

**www/test/authentication-spec.js**

```js
describe('Authentication', function () {
	var $controller, $httpBackend;
	var Account, authentication;

	beforeEach(angular.mock.module('taxi'));

	beforeEach(inject(function (_$controller_, _$httpBackend_, _Account_, _authentication_) {
    $controller = _$controller_;
		$httpBackend = _$httpBackend_;
    Account = _Account_;
		authentication = _authentication_;
	}));

	it('should allow a user to sign up for an account', function() {
    var SignUpController = $controller('SignUpController');
    var responseData = {
      'id': 1,
      'username': 'rider@example.com',
      'groups': ['rider']
    };

		$httpBackend.expectPOST('http://localhost:8000/api/sign_up/').respond(201, responseData);

    spyOn(authentication, 'signUp').and.callThrough();

    SignUpController.form = {
      'username': 'rider@example.com',
      'password1': 'pAssw0rd!',
      'password2': 'pAssw0rd!',
      'group': 'rider'
    }
    SignUpController.submit();

    $httpBackend.flush();

    expect(authentication.signUp).toHaveBeenCalledWith('rider@example.com', 'pAssw0rd!', 'rider');
		expect(Account.user).toEqual(responseData);
	});
});
```

We need a way to persist our user data in a way that makes it available to any object that needs it. Angular services are singleton objects, which means that we can use them to define global data stores. We can develop an `Account` model with a `user` attribute, and we can update that model when our `authentication.signUp()` function resolves successfully. Any changes that are made to our `Account` model are accessible by any module that imports it, so we can use it in an assertion within our test function.

Tests fail, so let's create the code necessary to get them passing.

**www/app/src/app.js**

```js
function Account() {
  this.user = {};
}

function authentication($http, $q, Account) {
	this.signUp = function signUp(username, password, group) {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/sign_up/', {
			username: username,
			password1: password,
			password2: password,
			group: group
		}).then(function (response) {
			Account.user = response.data;
			deferred.resolve(Account);
		}, function (response) {
			deferred.reject(response.data);
		});
		return deferred.promise;
	};

  this.logIn = function logIn(username, password) {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/log_in/', {
			username: username,
			password: password
		}).then(function (response) {
			Account.user = response.data;
			deferred.resolve(Account);
		}, function (response) {
			deferred.reject(response.data);
		});
		return deferred.promise;
	};

  this.logOut = function logOut() {
		var deferred = $q.defer();
		$http.post('http://localhost:8000/api/log_out/', null, {
			headers: {
				Authorization: 'Token ' + Account.user.auth_token
			}
		}).finally(function () {
			Account.user = {};
			deferred.resolve(Account);
		});
		return deferred.promise;
	};
}

angular.module('taxi', ['ui.router'])
  // Others hidden for clarity...
	.service('Account', [Account])
  .service('authentication', ['$http', '$q', 'Account', authentication]);
```

On a successful request, we set our `Account.user` to equal the response data, and then we pass the `Account` model itself through the promise. When we check the Karma tests, we see that they are now passing.

Next, we will apply the same changes to the log in form that we did to sign up.

**www/test/authentication-spec.js**

```js
it('should allow a user to log in', function () {
	var LogInController = $controller('LogInController');
  var responseData = {
		'id': 1,
		'username': 'rider@example.com',
		'groups': ['rider'],
		'auth_token': '2df504b532e39a49e05b08b8ba718f7a327b8f76'
	};

	$httpBackend.expectPOST('http://localhost:8000/api/log_in/').respond(200, responseData);

  spyOn(authentication, 'logIn').and.callThrough();

	LogInController.form = {
		'username': 'rider@example.com',
		'password': 'pAssw0rd!'
	};
	LogInController.submit();

	$httpBackend.flush();

  expect(authentication.logIn).toHaveBeenCalledWith('rider@example.com', 'pAssw0rd!');
	expect(Account.user).toEqual(responseData);
});
```

Again, we refactor our test to use the controller instead of the `authentication` service directly to communicate with the server. 

**www/app/src/app.js**

```js
function LogInController($state, authentication) {
	var vm = this;

	vm.form = {
		username: '',
		password: ''
	};

	vm.isFormInvalid = function isFormInvalid() {
		return vm.form.$invalid;
	};

	vm.submit = function submit() {
		authentication.logIn(vm.form.username, vm.form.password).then(function () {
			$state.go('landing');
		}, function () {
			vm.form = {
				username: '',
				password: ''
			};
		});
	};
}

angular.module('taxi', ['ui.router'])
	// Others hidden for clarity...
	.controller('LogInController', ['$state', 'authentication', LogInController]);
```

The log in form is simpler; it only requires the user to enter a username and a password. If the user is successfully logged in, then the application redirects him back to the landing page.

**www/app/src/log-in.html**

```html
<div class="row">
  <div class="col-lg-offset-4 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">Log in</h4>
      </div>
      <div class="panel-body">
        <form novalidate ng-submit="vm.submit()">
          <div class="form-group">
            <label for="username">Username:</label>
            <input id="username" class="form-control" type="text" ng-model="vm.form.username" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input id="password" class="form-control" type="password" ng-model="vm.form.password" required>
          </div>
          <button class="btn btn-primary btn-block" type="submit" ng-disabled="vm.form.$invalid">Log in</button>
        </form>
      </div>
    </div>
    <p class="text-center">Don't have an account? <a href ui-sref="sign_up">Sign up!</a></p>
  </div>
</div>
```

We apply the same `ng-submit`, `ng-model`, `required`, and `ng-disabled` attributes to the appropriate form controls. Manually test the app to confirm that the form works. You should be able to log in to the application after having created a new user. Also, Karma tests should be passing.

Lastly, we will add a controller to our landing page.

**www/test/authentication-spec.js**

```js
it('should allow a user to log out', function () {
	var LandingController = $controller('LandingController', {'$scope': $rootScope.$new()});

	$httpBackend.expectPOST('http://localhost:8000/api/log_out/').respond(204, {});

  spyOn(authentication, 'logOut').and.callThrough();

	LandingController.logOut();

	$httpBackend.flush();

  expect(authentication.logOut).toHaveBeenCalled();
	expect(Account.user).toEqual({});
});
```

We start by modifying our test to use a controller. This controller is simple; there are no forms to deal with. We merely add a `logOut()` function onto the controller that calls the `authentication.logOut()` function. Notice that unlike our other controllers, we are passing a `$scope` instance into the `LandingController`. In Angular, the _scope_ is the application model. All of the communication that happens between HTML templates and JavaScript code occurs with the assistance of the _scope_. When we set up two-way binding between a form control and a controller property through the `ng-model` directive, for example, Angular adds a special "watcher" that keeps track of any changes to the property via the scope. We can programmatically add our own "watchers" to the scope too, and we can tell them to execute code when a change is observed. In the code below, we watch the `Account.user` property and update our `LandingController` data when the user data changes.

**www/app/src/app.js**

```js
function LandingController($scope, $state, Account, authentication) {
	var vm = this;

  vm.hasUser = Account.user.hasOwnProperty('id');
	vm.user = Account.user;

	vm.logOut = function logOut() {
		authentication.logOut().finally(function () {
			$state.go('log_in');
		});
	};

	$scope.$watchCollection(function () {
    return Account.user;
  }, function (newValue, oldValue) {
    if (newValue) {
      vm.hasUser = Account.user.hasOwnProperty('id');
		  vm.user = Account.user;
    }
	});
}

angular.module('taxi', ['ui.router'])
	// Others hidden for clarity...
	.controller('LandingController', ['$scope', '$state', 'Account', 'authentication', LandingController]);
```

We set up two properties on our controller, `hasUser` and `user`. The `hasUser` property can be used to conditionally toggle behavior based on whether a user is logged in. The `user` property provides the actual details of the logged-in user, including the username. We update both of these properties whenever the `Account` model changes.

With these changes, our Karma tests should now pass.

**www/app/src/landing.html**

```html
<div class="middle-center" ng-if="!vm.hasUser">
  <h1>Taxi</h1>
  <a class="btn btn-primary" href ui-sref="log_in">Log in</a>
  <a class="btn btn-primary" href ui-sref="sign_up">Sign up</a>
</div>
<div class="middle-center" ng-if="vm.hasUser">
  <h1>Welcome, {{ vm.user.username }}</h1>
  <button class="btn btn-primary" type="button" ng-click="vm.logOut()">Log out</a>
</div>
```

We make one more change to our HTML to improve our user experience. If a user is logged in, he shouldn't see "Sign up" and "Log in" buttons. Along the same vein, if he is logged out, he shouldn't be given the option to log out again. It would also be nice if we greeted our user by name when he logged in. These changes accomplish those goals. We introduce a new Angular directive, `ng-if`, that can conditionally display an HTML element if the passed-in expression evaluates to `true`. In our case, if no user data exists, then we can assume that a user has not logged in, in which case we will show them the "Sign up" and "Log in" buttons. If user data does exist, then we make the opposite assumption. We welcome them by name and provide a "Log out" button. The last thing we add is the `ng-click` directive to the "Log out" button, which will trigger the `logOut()` function on the controller to fire when the button is clicked.
