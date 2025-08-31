from .models import Quiz, Question, Answer
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from django.db import transaction

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token


# Set 1: For creating and retrieving each individually
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'difficulty', 'time', 'category']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'content', 'correct']

# Set 2: For retrieving a Quiz and all its contents
class AnswerSerializer2(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Answer
        fields = ['id', 'content', 'correct']

class QuestionSerializer2(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    answers = AnswerSerializer2(many=True)

    class Meta:
        model = Question
        fields = ['id', 'content', 'answers']

class QuizSerializer2(serializers.ModelSerializer):
    # questions = QuestionSerializer(source='question_set', many=True, read_only=True)
    questions = QuestionSerializer2(many=True, write_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'difficulty', 'difficulty_display', 
                  'time', 'category', 'questions']
        extra_kwargs = {
            'questions': {'write_only': True}
        }

    @transaction.atomic
    def create(self, validated_data):
        # Extract the nested 'questions' data
        questions_data = validated_data.pop('questions', [])

        # Create the Quiz instance
        quiz = Quiz.objects.create(**validated_data)

        # Iterate through the questions and create them
        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = Question.objects.create(quiz=quiz, **question_data)

            # Iterate through the answers and create them
            Answer.objects.bulk_create([
                Answer(question=question, **ad) for ad in answers_data
            ])

        return quiz
    
    @transaction.atomic
    def update(self, instance: Quiz, validated_data):
        """
        PUT: full replacement semantics on nested children
        PATCH: partial on parent fields, nested if provided
        Upsert by `id` for questions/answers; remove children not present.
        """
        questions_data = validated_data.pop("questions", None)

        # Update scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if questions_data is None:
            # PATCH without nested payload
            return instance

        # Existing children maps
        existing_qs = {q.id: q for q in instance.questions.all().prefetch_related("answers")}
        seen_q_ids = set()

        for qd in questions_data:
            ans_data = qd.pop("answers", [])
            q_id = qd.pop("id", None)

            if q_id and q_id in existing_qs:
                # Update Question
                q = existing_qs[q_id]
                for attr, value in qd.items():
                    setattr(q, attr, value)
                q.save()
                seen_q_ids.add(q_id)

                # Answers upsert
                existing_ans = {a.id: a for a in q.answers.all()}
                seen_a_ids = set()

                for ad in ans_data:
                    a_id = ad.pop("id", None)
                    if a_id and a_id in existing_ans:
                        a = existing_ans[a_id]
                        for attr, value in ad.items():
                            setattr(a, attr, value)
                        a.save()
                        seen_a_ids.add(a_id)
                    else:
                        Answer.objects.create(question=q, **ad)

                # Delete removed answers
                to_delete = [a for aid, a in existing_ans.items() if aid not in seen_a_ids]
                if to_delete:
                    Answer.objects.filter(id__in=[a.id for a in to_delete]).delete()

            else:
                # Create Question + Answers
                q = Question.objects.create(quiz=instance, **qd)
                Answer.objects.bulk_create([Answer(question=q, **ad) for ad in ans_data])
                seen_q_ids.add(q.id)

        # Delete removed questions (and cascading answers)
        to_delete_qs = [q for qid, q in existing_qs.items() if qid not in seen_q_ids]
        if to_delete_qs:
            Question.objects.filter(id__in=[q.id for q in to_delete_qs]).delete()

        return instance
    
# Read serializer to return nested tree
class AnswerOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "content", "correct"]

class QuestionOutSerializer(serializers.ModelSerializer):
    answers = AnswerOutSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ["id", "content", "answers"]

class QuizReadSerializer(serializers.ModelSerializer):
    # read-only nested tree
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    questions = QuestionOutSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'difficulty', 'difficulty_display',
            'time', 'category', 'questions'
        ]
