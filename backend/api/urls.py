from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, IdeaViewSet, AdminIdeaViewSet, IdeaFeedbackViewSet, IdeaLikeViewSet, CalendarEventViewSet, EventRsvpViewSet, NewsArticleViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'feedback', IdeaFeedbackViewSet)
router.register(r'likes', IdeaLikeViewSet)
router.register(r'events', CalendarEventViewSet)
router.register(r'rsvps', EventRsvpViewSet)
router.register(r'news', NewsArticleViewSet)

admin_router = DefaultRouter()
admin_router.register(r'ideas', AdminIdeaViewSet, basename='admin-idea')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', include(admin_router.urls)),
]
