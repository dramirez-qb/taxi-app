import re
from rest_framework.authtoken.models import Token


class TokenAuthMiddleware:

    TOKEN_PATTERN = re.compile(r'Token (?P<access_token>\w+)')

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        for name, value in scope.get('headers', []):
            if name.upper() == 'AUTHORIZATION':
                match = re.match(self.TOKEN_PATTERN, value)
                if match:
                    access_token = match.groupdict().get('access_token')
                    try:
                        token = Token.objects.select_related('user').get(key=access_token)
                    except Token.DoesNotExist:
                        raise ValueError('Invalid token.')
                    else:
                        scope['user'] = token.user
                else:
                    raise ValueError('Expecting an authorization token.')

        return self.inner(scope)
