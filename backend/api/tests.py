# backend/api/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import User, Idea, IdeaLike


class FinalConsolidatedTests(APITestCase):
    """
    Uma única classe de teste consolidada para evitar conflitos de banco de dados
    entre execuções de diferentes classes TestCase.
    """
    @classmethod
    def setUpTestData(cls):
        """Cria todos os dados necessários para os testes de uma só vez."""
        cls.user1 = User.objects.create_user(username='test_user_1', email='user1@test.com', password='password')
        cls.admin = User.objects.create_superuser(username='test_admin', email='admin@test.com', password='password')
        cls.token1 = Token.objects.create(user=cls.user1)

        cls.idea1 = Idea.objects.create(
            user=cls.user1,
            title='Ideia de Teste 1',
            description='Descrição detalhada da ideia 1.',
            submitted_by_email='user1@test.com',
            full_name='Utilizador Um',
            submission_type='Apenas eu',
            business_unit='Operadora Unimed',
            department='TI',
            position='Developer',
            idea_category='Tecnologia',
            expected_benefits='Benefício 1'
        )

        cls.idea_anon = Idea.objects.create(
            title='Ideia Anónima para Signal',
            description='...',
            submitted_by_email='signal_user@test.com',
            full_name='Futuro Utilizador',
            submission_type='Apenas eu',
            business_unit='Hospital Unimed Primavera (HUP)',
            department='Enfermagem',
            position='Enfermeiro',
            idea_category='Melhoria de Processo',
            expected_benefits='Teste de signal'
        )

        IdeaLike.objects.create(idea=cls.idea1, user=cls.user1)

    def test_model_string_representation(self):
        """Testa a representação em string dos modelos."""
        self.assertEqual(str(self.idea1), 'Ideia de Teste 1')
        self.assertEqual(str(self.user1), 'test_user_1')

    def test_security_user_list_permission(self):
        """Verifica se utilizadores normais não podem listar outros utilizadores."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_security_idea_creation_is_public(self):
        """Verifica se qualquer pessoa pode criar uma ideia."""
        url = reverse('idea-list')
        data = {
            'title': 'Ideia Pública', 'description': '...', 'submitted_by_email': 'public@test.com',
            'full_name': 'Pessoa Pública', 'submission_type': 'Apenas eu', 'business_unit': 'Unihome',
            'department': 'Comercial', 'position': 'Vendedor', 'idea_category': 'Sustentabilidade',
            'expected_benefits': 'Mundo melhor'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_api_get_user_profile(self):
        """Testa a obtenção do perfil do utilizador via API."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1.key}')
        response = self.client.get(reverse('user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user1.username)

    def test_api_update_user_profile(self):
        """Testa a atualização do perfil do utilizador via API."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1.key}')
        data = {'first_name': 'PrimeiroNome', 'last_name': 'UltimoNome'}
        response = self.client.patch(reverse('user-profile'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.first_name, 'PrimeiroNome')

    def test_feature_likes_in_serializer(self):
        """Testa se os likes aparecem corretamente no serializer da ideia."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(reverse('idea-detail', kwargs={'pk': self.idea1.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['likes']), 1)
        self.assertEqual(response.data['likes'][0]['id'], self.user1.id)

    def test_admin_can_set_user_role(self):
        """Testa se um admin pode alterar o papel de outro utilizador."""
        self.client.force_authenticate(user=self.admin)
        url = reverse('user-set-role', kwargs={'pk': self.user1.pk})
        response = self.client.patch(url, {'role': 'admin'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.role, 'admin')

    def test_logic_signal_assigns_idea_on_user_creation(self):
        """Testa o signal que atribui uma ideia a um utilizador recém-criado."""
        self.assertIsNone(self.idea_anon.user)
        # Criação do utilizador que dispara o signal
        new_user = User.objects.create_user(username='signal_user', email='signal_user@test.com', password='password')
        self.idea_anon.refresh_from_db()
        self.assertEqual(self.idea_anon.user, new_user)
