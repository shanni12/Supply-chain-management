from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken,ProductSerializer


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    print(request.data)
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
@api_view(['POST'])
def createproduct(request):
    print(222222222)
    serializer=ProductSerializer(data=request.data)
    if(serializer.is_valid()):
        serializer.save()
    print(serializer.data)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)
   
    def post(self, request, format=None):
        # data={'username':request.data['username'],'password':request.data['password']}
        print(request.data)
        serializer = UserSerializerWithToken(data=request.data)
        
       
        if serializer.is_valid():
            # print(serializer.data)
            serializer.save()
            print(serializer.data)
            print(111)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)