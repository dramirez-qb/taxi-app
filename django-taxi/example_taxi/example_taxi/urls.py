from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.generic import TemplateView
from example.apis import SignUpView, LogInView, LogOutView

urlpatterns = [
    path('api/trip/', include(('example.urls', 'example',))),
    path('api/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('api/log_in/', LogInView.as_view(), name='log_in'),
    path('api/log_out/', LogOutView.as_view(), name='log_out'),
    path('', TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
