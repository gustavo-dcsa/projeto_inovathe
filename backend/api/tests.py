from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Idea

class IdeaAPITest(APITestCase):
    def test_create_idea(self):
        """
        Ensure we can create a new idea object.
        """
        url = reverse('idea-list') # The router generates this name
        data = {
            'title': 'New Test Idea',
            'description': 'A new test description.',
            'submitted_by_email': 'test@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Idea.objects.count(), 1)
        self.assertEqual(Idea.objects.get().title, 'New Test Idea')

    def test_list_ideas(self):
        """
        Ensure we can list idea objects.
        """
        Idea.objects.create(
            title="Test Idea 1",
            description="A test description.",
            submitted_by_email="test1@example.com"
        )
        Idea.objects.create(
            title="Test Idea 2",
            description="Another test description.",
            submitted_by_email="test2@example.com"
        )
        url = reverse('idea-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
