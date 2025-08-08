from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username

def generate_idea_id():
    # The format is `idea-` followed by the first 6 characters of a UUID4 hex string.
    # This creates a short, unique, and readable ID.
    return f"idea-{uuid.uuid4().hex[:6]}"

class Idea(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('in_department_review', 'In Department Review'),
        ('in_committee_review', 'In Committee Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('implemented', 'Implemented'),
    )
    id = models.CharField(max_length=11, primary_key=True, default=generate_idea_id, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='submitted')
    submitted_by_email = models.EmailField()
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='ideas')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class IdeaFeedback(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='feedback')
    feedback_text = models.TextField()
    author = models.ForeignKey('User', on_delete=models.CASCADE, related_name='feedbacks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.idea.title} by {self.author.username}"

class IdeaLike(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('idea', 'user')

class CalendarEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.title

class EventRsvp(models.Model):
    event = models.ForeignKey(CalendarEvent, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='rsvps')

    class Meta:
        unique_together = ('event', 'user')

class NewsArticle(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    source_url = models.URLField(blank=True, null=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='articles')

    def __str__(self):
        return self.title
