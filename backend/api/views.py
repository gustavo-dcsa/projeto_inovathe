from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle
from .serializers import UserSerializer, IdeaSerializer, IdeaFeedbackSerializer, IdeaLikeSerializer, CalendarEventSerializer, EventRsvpSerializer, NewsArticleSerializer
from .permissions import IsAdminOrReadOnly
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

@extend_schema(tags=['Usuários'])
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar usuários.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

@extend_schema(tags=['Ideias'])
class IdeaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar ideias.
    """
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAdminOrReadOnly]

    @extend_schema(
        summary="Atualiza o status de uma ideia (somente admin)",
        description="Permite que um administrador atualize o status de uma ideia específica.",
        request=IdeaSerializer,
        responses={200: IdeaSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        idea = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            idea.status = new_status
            idea.save()
            return Response(self.get_serializer(idea).data)
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Adiciona feedback a uma ideia (somente admin)",
        description="Permite que um administrador adicione um feedback a uma ideia específica.",
        request=IdeaFeedbackSerializer,
        responses={200: OpenApiTypes.OBJECT}
    )
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

@extend_schema(tags=['Feedback de Ideias'])
class IdeaFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar feedbacks de ideias.
    """
    queryset = IdeaFeedback.objects.all()
    serializer_class = IdeaFeedbackSerializer

@extend_schema(tags=['Likes de Ideias'])
class IdeaLikeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar likes em ideias.
    """
    queryset = IdeaLike.objects.all()
    serializer_class = IdeaLikeSerializer

@extend_schema(tags=['Eventos'])
class CalendarEventViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar eventos do calendário.
    """
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

@extend_schema(tags=['RSVPs de Eventos'])
class EventRsvpViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar RSVPs em eventos.
    """
    queryset = EventRsvp.objects.all()
    serializer_class = EventRsvpSerializer

@extend_schema(tags=['Artigos de Notícias'])
class NewsArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar artigos de notícias.
    """
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer

@extend_schema(tags=['Minhas Ideias'])
class MyIdeasViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar as ideias do usuário autenticado.
    """
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.filter(user=self.request.user)
