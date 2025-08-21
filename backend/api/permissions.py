from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admin users to edit an object.
    Read-only access is allowed for any user (authenticated or not).
    """

    def has_permission(self, request, view):
        # Allow all GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users.
        return request.user and request.user.is_staff


class AllowCreateAnyReadAuthenticated(BasePermission):
    """
    Custom permission to allow unauthenticated users to create an object.
    Read access is allowed for authenticated users.
    """

    def has_permission(self, request, view):
        if request.method in ['POST', 'GET']:
            return True
        return request.user and request.user.is_authenticated
