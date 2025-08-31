from django.urls import path, include
from .views import UserRegistrationView, CustomTokenObtainPairView, QuizViewSet, QuestionViewSet, AnswerViewSet, QuizViewSet2
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'quizzes2', QuizViewSet2, basename='quiz2')

urlpatterns = [
    path('', include(router.urls)),
    path('register', UserRegistrationView.as_view(), name='user_registration'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]