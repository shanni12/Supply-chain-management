import json
import time

import requests
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken, ProductSerializer
from .models import Profile, User, Product


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
def send_product(request):
    is_db_updated = False
    blockchain_data = {}
    try:
        if request.data["user_type"] == "farmer":
            data = dict(owner=request.data["send_to"],
                        product_name=request.data["product_name"],
                        product_quantity=request.data["product_quantity"],
                        product_details=request.data["product_details"],
                        is_available=True,
                        sent_by=request.data["user"])
            p = Product.objects.create(**data)
            is_db_updated = True
            blockchain_data = {
                "sent_by": request.data["user"],
                "sent_to": request.data["send_to"],
                "product_name": request.data["product_name"],
                "product_quantity": request.data["product_quantity"],
                "product_details": request.data["product_details"],
                "product_id": str(p.product_id),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        if request.data["user_type"] == "distributor":
            blockchain_data={
                "sent_by": request.data["user"],
                "sent_to": request.data["send_to"],
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "transport_details": request.data.get("transport_details", ""),
                "product_id": request.data["product_id"]
            }
            Product.objects.filter(product_id=request.data["product_id"]).update(is_available=False,
                                                                                 sent_by=request.data["user"],
                                                                                 owner=request.data['send_to'])
            is_db_updated = True
        if is_db_updated:
            requests.post('http://127.0.0.1:5000/blockchain/add_block', data=json.dumps(blockchain_data),
                          headers={'Content-type': 'application/json'})
        return Response("Product sent successfully")
    except Exception as e:
        print("Something went wrong!!", e)
    return Response("Something went wrong!!")



@api_view(['GET'])
def get_user_details(request):
    actors_to_send_products = []
    user = User.objects.get(username=request.user)
    available_products=[]
    if user.profile.type_of_user == "farmer":
        for distributor in Profile.objects.filter(type_of_user="distributor"):
            actors_to_send_products.append(distributor.user.username)
    elif user.profile.type_of_user == "distributor":
        for distributor in Profile.objects.filter(type_of_user="retailer"):
            actors_to_send_products.append(distributor.user.username)
        available_products = [{"product_name": product.product_name,
                        "product_id": product.product_id} for product in
                         Product.objects.filter(owner=request.user, is_available=True)]
    elif user.profile.type_of_user== "customer":
        available_products=[{"product_name": product.product_name,
                           "product_id": product.product_id} for product in
                          Product.objects.filter(is_available=False)]

    
   
    
    print({
        "actors_to_send_products": actors_to_send_products,
        "type_of_user": user.profile.type_of_user,
        "products": available_products
    })
    return Response({
    
        "actors_to_send_products": actors_to_send_products,
        "type_of_user": user.profile.type_of_user,
        "products": available_products
    }
    )


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        # data={'username':request.data['username'],'password':request.data['password']}
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
