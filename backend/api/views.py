from rest_framework import viewsets
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle
from .serializers import UserSerializer, IdeaSerializer, IdeaFeedbackSerializer, IdeaLikeSerializer, CalendarEventSerializer, EventRsvpSerializer, NewsArticleSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer

class IdeaFeedbackViewSet(viewsets.ModelViewSet):
    queryset = IdeaFeedback.objects.all()
    serializer_class = IdeaFeedbackSerializer

class IdeaLikeViewSet(viewsets.ModelViewSet):
    queryset = IdeaLike.objects.all()
    serializer_class = IdeaLikeSerializer

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

class EventRsvpViewSet(viewsets.ModelViewSet):
    queryset = EventRsvp.objects.all()
    serializer_class = EventRsvpSerializer

class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer
