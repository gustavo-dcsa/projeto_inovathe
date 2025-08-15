from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Idea, User, IdeaLike
from django.db import IntegrityError
from django.core.files.uploadedfile import SimpleUploadedFile

class SecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password', email='user@example.com')
        self.admin = User.objects.create_superuser(username='admin', password='password', email='admin@example.com')

    def test_user_viewset_permissions(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_idea_viewset_permissions(self):
        url = reverse('idea-list')
        data = {'title': 'Test', 'description': 'Test', 'submitted_by_email': 'test@test.com', 'full_name': 'Test', 'submission_type': 'Apenas eu', 'business_unit': 'Operadora Unimed', 'department': 'TI', 'position': 'Developer', 'idea_category': 'Tecnologia', 'expected_benefits': 'Muitos beneficios'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class IdeaModelTests(APITestCase):
    def test_idea_model_defaults(self):
        idea = Idea.objects.create(title='Test', description='Test', submitted_by_email='test@test.com', full_name='Test', submission_type='Apenas eu', business_unit='Operadora Unimed', department='TI', position='Developer', idea_category='Tecnologia', expected_benefits='Muitos beneficios')
        self.assertEqual(idea.status, 'pending')
        self.assertEqual(idea.stage, 'submitted')

class UserProfileAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password', email='user@example.com')
        self.token = Token.objects.create(user=self.user)

    def test_get_user_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_update_user_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {'first_name': 'Test', 'last_name': 'User'}
        response = self.client.patch(reverse('user-profile'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Test')

class LikeFeatureTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='password', email='user2@example.com')
        self.idea = Idea.objects.create(title='Test', description='Test', submitted_by_email='test@test.com', full_name='Test', submission_type='Apenas eu', business_unit='Operadora Unimed', department='TI', position='Developer', idea_category='Tecnologia', expected_benefits='Muitos beneficios')
        IdeaLike.objects.create(idea=self.idea, user=self.user1)
        IdeaLike.objects.create(idea=self.idea, user=self.user2)

    def test_idea_serializer_nested_likes(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(reverse('idea-detail', kwargs={'pk': self.idea.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['likes']), 2)
        self.assertEqual(response.data['likes'][0]['full_name'], self.user1.get_full_name())

class AdminDashboardAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password', email='user@example.com')
        self.admin = User.objects.create_superuser(username='admin', password='password', email='admin@example.com')

    def test_set_user_role(self):
        self.client.force_authenticate(user=self.admin)
        data = {'role': 'admin'}
        response = self.client.patch(reverse('user-detail', kwargs={'pk': self.user.pk}) + 'set_role/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'admin')

class UserAttributionTests(APITestCase):
    def test_user_attribution_signal(self):
        idea = Idea.objects.create(title='Test', description='Test', submitted_by_email='newuser@example.com', full_name='Test', submission_type='Apenas eu', business_unit='Operadora Unimed', department='TI', position='Developer', idea_category='Tecnologia', expected_benefits='Muitos beneficios')
        user = User.objects.create_user(username='newuser', password='password', email='newuser@example.com')
        idea.refresh_from_db()
        self.assertEqual(idea.user, user)
