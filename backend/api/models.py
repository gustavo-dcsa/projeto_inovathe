from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils import timezone
import uuid


class CustomUserManager(UserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not email:
            raise ValueError('O campo email é obrigatório')
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'Usuário'),
        ('admin', 'Administrador'),
    )
    email = models.EmailField(unique=True, blank=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    objects = CustomUserManager()

    def __str__(self):
        return self.username


def generate_idea_id():
    return f"idea-{uuid.uuid4().hex[:6]}"


class Idea(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('in_analysis', 'Em Análise'),
        ('re_evaluation', 'Em Reavaliação'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
    )
    STAGE_CHOICES = (
        ('submitted', 'Submetido'),
        ('innovation_sector', 'Setor de Inovação'),
        ('responsible_manager', 'Gestor Responsável'),
        ('innovation_committee', 'Comitê de Inovação'),
        ('board_of_directors', 'Diretoria'),
        ('projects', 'Projetos'),
        ('implemented', 'Implementado'),
    )
    SUBMISSION_TYPE_CHOICES = (
        ('Apenas eu', 'Apenas eu'),
        ('Com minha equipe', 'Com minha equipe'),
    )
    BUSINESS_UNIT_CHOICES = (
        ('Operadora Unimed', 'Operadora Unimed'),
        ('Operadora Intermed', 'Operadora Intermed'),
        ('Hospital Unimed Primavera (HUP)', 'Hospital Unimed Primavera (HUP)'),
        ('Centro Integrado Ilhotas (CIS)', 'Centro Integrado Ilhotas (CIS)'),
        ('Unihome', 'Unihome'),
        ('Unimed Parnaíba', 'Unimed Parnaíba'),
        ('Intermed Parnaíba', 'Intermed Parnaíba'),
        ('TheAcolher', 'TheAcolher'),
    )
    CATEGORY_CHOICES = (
        ('Inovação de Produto/Serviço', 'Inovação de Produto/Serviço'),
        ('Melhoria de Processo', 'Melhoria de Processo'),
        ('Redução de Custos', 'Redução de Custos'),
        ('Aumento de Produtividade', 'Aumento de Produtividade'),
        ('Satisfação do Cliente', 'Satisfação do Cliente'),
        ('Bem-estar dos Colaboradores', 'Bem-estar dos Colaboradores'),
        ('Sustentabilidade', 'Sustentabilidade'),
        ('Tecnologia', 'Tecnologia'),
        ('Outro', 'Outro'),
    )
    IMPACT_CHOICES = (
        ('Baixo', 'Baixo'),
        ('Médio', 'Médio'),
        ('Alto', 'Alto'),
    )
    TIMELINE_CHOICES = (
        ('Curto prazo (até 3 meses)', 'Curto prazo (até 3 meses)'),
        ('Médio prazo (3 a 6 meses)', 'Médio prazo (3 a 6 meses)'),
        ('Longo prazo (mais de 6 meses)', 'Longo prazo (mais de 6 meses)'),
    )

    # Existing fields
    id = models.CharField(max_length=11, primary_key=True, default=generate_idea_id, editable=False)
    title = models.CharField(max_length=100)  # Max length from form
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='submitted')
    submitted_by_email = models.EmailField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ideas')
    created_at = models.DateTimeField(auto_now_add=True)

    # New fields from the form
    full_name = models.CharField(max_length=255)
    submission_type = models.CharField(max_length=50, choices=SUBMISSION_TYPE_CHOICES)
    team_members = models.CharField(max_length=255, blank=True, null=True)
    business_unit = models.CharField(max_length=100, choices=BUSINESS_UNIT_CHOICES)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    idea_category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    expected_benefits = models.TextField()
    required_resources = models.TextField(blank=True, null=True)
    estimated_impact = models.CharField(max_length=50, choices=IMPACT_CHOICES, blank=True, null=True)
    implementation_timeline = models.CharField(max_length=50, choices=TIMELINE_CHOICES, blank=True, null=True)
    inspiration = models.CharField(max_length=255, blank=True, null=True)
    additional_comments = models.TextField(blank=True, null=True)

    # New fields for admin panel
    is_featured = models.BooleanField(default=False)
    current_location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title


class IdeaFeedback(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='feedback')
    feedback_text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.idea.title} by {self.author.username}"


class IdeaLike(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('idea', 'user')


class CalendarEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.title


class EventRsvp(models.Model):
    event = models.ForeignKey(CalendarEvent, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rsvps')

    class Meta:
        unique_together = ('event', 'user')


class NewsArticle(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    source_url = models.URLField(blank=True, null=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')

    def __str__(self):
        return self.title
