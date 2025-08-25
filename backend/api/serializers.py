from rest_framework import serializers
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 'position', 'profile_photo']
        read_only_fields = ['username', 'email']


class UserLikeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'profile_photo_url']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None


class IdeaSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = '__all__'

    def get_likes(self, obj):
        users = [like.user for like in obj.likes.all()]
        return UserLikeSerializer(users, many=True).data


class IdeaFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdeaFeedback
        fields = '__all__'


class IdeaLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdeaLike
        fields = '__all__'


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'


class EventRsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRsvp
        fields = '__all__'


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'


class CustomLoginSerializer(LoginSerializer):
    def get_auth_user(self, username, email, password):
        """
        Overrides the default method to allow login with either username or email.
        'username' field in the serializer can be either the actual username or the email.
        """
        User = get_user_model()
        try:
            # Check if the identifier is an email
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # If not an email, check if it is a username
            try:
                user = User.objects.get(username=username)
                if user.check_password(password):
                    return user
            except User.DoesNotExist:
                pass  # Fall through to the default error handling
        return None
