from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle
from .serializers import UserSerializer, IdeaSerializer, IdeaFeedbackSerializer, IdeaLikeSerializer, CalendarEventSerializer, EventRsvpSerializer, NewsArticleSerializer
from .permissions import IsAdminOrReadOnly

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAdminOrReadOnly]

    def partial_update(self, request, *args, **kwargs):
        idea = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            idea.status = new_status
            idea.save()
            return Response(self.get_serializer(idea).data)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def feedback(self, request, pk=None):
        idea = self.get_object()
        feedback_text = request.data.get('feedback_text')
        if feedback_text:
            IdeaFeedback.objects.create(
                idea=idea,
                feedback_text=feedback_text,
                author=request.user
            )
            return Response({'status': 'feedback added'})
        return Response({'error': 'Feedback text not provided'}, status=status.HTTP_400_BAD_REQUEST)

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

class MyIdeasViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.filter(user=self.request.user)
