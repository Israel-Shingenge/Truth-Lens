from .serializer import UserRegistrationSerializer,  CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from .serializer import QuestionSerializer, AnswerSerializer
from .models import Question, Answer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': serializer.data,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-published_date')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['content']
    ordering_fields = ['published_date']

    @action(detail=True, methods=['get', 'post'])
    def answers(self, request, pk=None):
        """
        GET /api/questions/{id}/answers/  → list answers for this question
        POST /api/questions/{id}/answers/ → create answer under this question
        """
        question = self.get_object()
        if request.method.lower() == 'get':
            qs = question.answers.all()
            return Response(AnswerSerializer(qs, many=True).data)
        # POST
        data = request.data.copy()
        data['question'] = question.pk
        serializer = AnswerSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.select_related('question').all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['content']
