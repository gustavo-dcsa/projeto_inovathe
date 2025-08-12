from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle
from .serializers import UserSerializer, IdeaSerializer, IdeaFeedbackSerializer, IdeaLikeSerializer, CalendarEventSerializer, EventRsvpSerializer, NewsArticleSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [AllowAny]

class AdminIdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def feature(self, request, pk=None):
        idea = self.get_object()
        idea.is_featured = not idea.is_featured
        idea.save()
        return Response({'status': 'featured status changed'})

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        idea = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            idea.status = new_status
            idea.save()
            return Response({'status': 'idea status changed'})
        return Response({'error': 'New status not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_feedback(self, request, pk=None):
        idea = self.get_object()
        feedback_text = request.data.get('feedback_text')
        if feedback_text:
            IdeaFeedback.objects.create(
                idea=idea,
                feedback_text=feedback_text,
                author=request.user
            )
            # Here you would trigger an email notification
            return Response({'status': 'feedback added'})
        return Response({'error': 'Feedback text not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        idea = self.get_object()
        new_location = request.data.get('location')
        if new_location:
            idea.current_location = new_location
            idea.save()
            return Response({'status': 'location updated'})
        return Response({'error': 'New location not provided'}, status=status.HTTP_400_BAD_REQUEST)


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
