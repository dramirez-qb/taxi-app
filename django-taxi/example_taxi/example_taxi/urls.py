from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView

from example.apis import SignUpView, LogInView, LogOutView


urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^api/trip/', include('example.urls', namespace='trip')),
    url(r'^api/sign_up/$', SignUpView.as_view(), name='sign_up'),
    url(r'^api/log_in/$', LogInView.as_view(), name='log_in'),
    url(r'^api/log_out/$', LogOutView.as_view(), name='log_out'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
