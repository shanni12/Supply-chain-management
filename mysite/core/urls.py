from django.urls import path
from .views import current_user, UserList, send_product, get_user_details

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('create_product/', send_product),
    path('get_user_details/', get_user_details)
]