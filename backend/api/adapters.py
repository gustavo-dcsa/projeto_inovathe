# backend/api/adapters.py

from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        """
        Esta é a função chave que vamos sobrescrever.
        Ela é chamada durante o processo de registro.
        """
        # A implementação padrão de save_user do allauth espera um 'form'.
        # No nosso caso, 'form' é na verdade um 'RegisterSerializer' do dj_rest_auth.
        # Vamos pegar os dados validados diretamente do serializador.
        data = form.cleaned_data

        # Popula os campos do usuário com os dados do serializador
        user.username = data.get('username')
        user.email = data.get('email')
        user.set_password(data.get('password'))

        # Salva o usuário no banco de dados
        if commit:
            user.save()

        return user
