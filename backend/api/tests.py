from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Idea, User
from django.db import IntegrityError

class UserCreationTest(APITestCase):
    def test_create_user_without_email_fails(self):
        """
        Ensure creating a user without an email raises a ValueError.
        """
        with self.assertRaises(ValueError):
            User.objects.create_user(username='testuser', password='password', email='')

class IdeaAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password', email='user@example.com')
        self.admin = User.objects.create_superuser(username='admin', password='password', email='admin@example.com')
        self.idea1 = Idea.objects.create(
            title="Test Idea 1",
            description="A test description.",
            submitted_by_email="test1@example.com",
            full_name="Test User 1",
            submission_type="Apenas eu",
            business_unit="Operadora Unimed",
            department="TI",
            position="Developer",
            idea_category="Tecnologia",
            expected_benefits="Muitos beneficios",
            user=self.user,
            status='approved'
        )
        self.idea2 = Idea.objects.create(
            title="Test Idea 2",
            description="Another test description.",
            submitted_by_email="test2@example.com",
            full_name="Test User 2",
            submission_type="Apenas eu",
            business_unit="Operadora Unimed",
            department="TI",
            position="Developer",
            idea_category="Tecnologia",
            expected_benefits="Muitos beneficios",
            is_featured=True
        )

    def test_create_idea(self):
        """
        Ensure we can create a new idea object.
        """
        self.client.force_authenticate(user=self.admin)
        url = reverse('idea-list') # The router generates this name
        data = {
            'title': 'New Test Idea',
            'description': 'A new test description.',
            'submitted_by_email': 'test@example.com',
            'full_name': 'Test User',
            'submission_type': 'Apenas eu',
            'business_unit': 'Operadora Unimed',
            'department': 'TI',
            'position': 'Developer',
            'idea_category': 'Tecnologia',
            'expected_benefits': 'Muitos beneficios'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Idea.objects.count(), 3)
        self.assertEqual(Idea.objects.get(title='New Test Idea').title, 'New Test Idea')

    def test_list_ideas(self):
        """
        Ensure we can list idea objects.
        """
        url = reverse('idea-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_single_idea(self):
        """
        Ensure we can retrieve a single idea.
        """
        url = reverse('idea-detail', kwargs={'pk': self.idea1.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.idea1.title)

    def test_retrieve_single_idea_with_correct_email(self):
        """
        Ensure we can retrieve a single idea with the correct email.
        """
        url = reverse('idea-detail', kwargs={'pk': self.idea1.pk})
        response = self.client.get(url, {'email': 'test1@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.idea1.title)

    def test_retrieve_single_idea_with_incorrect_email(self):
        """
        Ensure we cannot retrieve a single idea with an incorrect email.
        """
        url = reverse('idea-detail', kwargs={'pk': self.idea1.pk})
        response = self.client.get(url, {'email': 'wrong@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_filter_ideas_by_status(self):
        """
        Ensure we can filter ideas by status.
        """
        url = reverse('idea-list')
        response = self.client.get(url, {'status': 'approved'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.idea1.title)

    def test_filter_ideas_by_featured(self):
        """
        Ensure we can filter ideas by featured status.
        """
        url = reverse('idea-list')
        response = self.client.get(url, {'is_featured': 'true'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.idea2.title)

    def test_order_ideas_by_created_at(self):
        """
        Ensure we can order ideas by creation date.
        """
        url = reverse('idea-list')
        response = self.client.get(url, {'ordering': '-created_at'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], self.idea2.title)

    def test_update_idea_status_as_admin(self):
        """
        Ensure an admin can update an idea's status.
        """
        self.client.force_authenticate(user=self.admin)
        url = reverse('idea-detail', kwargs={'pk': self.idea1.pk})
        data = {'status': 'approved'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.idea1.refresh_from_db()
        self.assertEqual(self.idea1.status, 'approved')

    def test_update_idea_status_as_non_admin(self):
        """
        Ensure a non-admin cannot update an idea's status.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('idea-detail', kwargs={'pk': self.idea1.pk})
        data = {'status': 'approved'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_feedback_as_admin(self):
        """
        Ensure an admin can add feedback to an idea.
        """
        self.client.force_authenticate(user=self.admin)
        url = reverse('idea-feedback', kwargs={'pk': self.idea1.pk})
        data = {'feedback_text': 'This is great feedback!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.idea1.feedback.count(), 1)

    def test_add_feedback_as_non_admin(self):
        """
        Ensure a non-admin cannot add feedback to an idea.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('idea-feedback', kwargs={'pk': self.idea1.pk})
        data = {'feedback_text': 'This is great feedback!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_my_ideas(self):
        """
        Ensure a user can list their own ideas.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('my-ideas-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.idea1.title)

    def test_database_connection_with_new_schema(self):
        """
        Ensure the database connection works with the new schema.
        """
        self.assertTrue(Idea.objects.exists())
