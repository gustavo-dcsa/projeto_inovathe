from django.test import TestCase
from ..models import Idea

class IdeaModelTest(TestCase):
    def test_generate_idea_id(self):
        """
        Tests that the generate_idea_id function creates an ID in the correct format.
        """
        idea = Idea.objects.create(
            title="Test Idea",
            description="A test description.",
            submitted_by_email="test@example.com"
        )
        self.assertIn("idea-", idea.id)
        self.assertEqual(len(idea.id), 11) # "idea-" + 6 hex chars
