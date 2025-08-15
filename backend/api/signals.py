from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Idea

@receiver(post_save, sender=User)
def assign_ideas_to_new_user(sender, instance, created, **kwargs):
    """
    Assigns ideas to a new user based on their email address.
    """
    if created:
        Idea.objects.filter(submitted_by_email=instance.email, user__isnull=True).update(user=instance)
