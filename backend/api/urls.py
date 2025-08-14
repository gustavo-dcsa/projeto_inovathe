from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, IdeaViewSet, IdeaFeedbackViewSet, IdeaLikeViewSet, CalendarEventViewSet, EventRsvpViewSet, NewsArticleViewSet, MyIdeasViewSet, UserProfileView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'feedback', IdeaFeedbackViewSet)
router.register(r'likes', IdeaLikeViewSet)
router.register(r'events', CalendarEventViewSet)
router.register(r'rsvps', EventRsvpViewSet)
router.register(r'news', NewsArticleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-ideas/', MyIdeasViewSet.as_view({'get': 'list'}), name='my-ideas-list'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
]
