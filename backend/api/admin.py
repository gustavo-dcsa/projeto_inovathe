from django.contrib import admin
from .models import User, Idea, IdeaFeedback, IdeaLike, CalendarEvent, EventRsvp, NewsArticle

@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'submitted_by_email', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description', 'submitted_by_email')
    ordering = ('-created_at',)

# Register other models with default admin options
admin.site.register(User)
admin.site.register(IdeaFeedback)
admin.site.register(IdeaLike)
admin.site.register(CalendarEvent)
admin.site.register(EventRsvp)
admin.site.register(NewsArticle)
