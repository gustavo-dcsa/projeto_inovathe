from django.test import TestCase
from django.contrib.auth import get_user_model
from api.models import Idea


class IdeaModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(username='testuser', email='test@test.com', password='testpass')
        cls.idea = Idea.objects.create(
            submitted_by=cls.user,
            title='Teste',
            description='Descrição',
            status='pending',
            stage='submitted'
        )

    def test_idea_str(self):
        self.assertEqual(str(self.idea), 'Teste')
