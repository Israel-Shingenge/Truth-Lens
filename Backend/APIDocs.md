# API Documentation

## Quiz Creation

#### POST `localhost:8000/api/quizzes2/`

e.g payload

```
{
  "title": "Python Basics",
  "description": "Intro quiz",
  "difficulty": "BEGINNER",
  "time": 1,
  "category": "Python",
  "questions": [
    {
      "content": "What is the output of print(2+2)?",
      "answers": [
        {"content": "3", "correct": false},
        {"content": "4", "correct": true},
        {"content": "5", "correct": false}
      ]
    },
    {
      "content": "Which keyword defines a function?",
      "answers": [
        {"content": "def", "correct": true},
        {"content": "func", "correct": false}
      ]
    }
  ]
}
```

__Response example__

```
{
  "id": 1,
  "title": "Python Basics",
  "description": "Intro quiz",
  "difficulty": "BEGINNER",
  "difficulty_display": "Beginner",
  "time": 1,
  "category": "Python"
}
```

## Quiz Read

#### GET `localhost:8000/api/quizzes2/{quizID}/` 
e.g `localhost:8000/api/quizzes2/1/` \
__Response example__
```
{
  "id": 1,
  "title": "Python Basics",
  "description": "Intro quiz",
  "difficulty": "BEGINNER",
  "difficulty_display": "Beginner",
  "time": 1,
  "category": "Python",
  "questions": [
    {
      "content": "What is the output of print(2+2)?",
      "answers": [
        {
          "content": "3",
          "correct": false
        },
        {
          "content": "4",
          "correct": true
        },
        {
          "content": "5",
          "correct": false
        }
      ]
    },
    {
      "content": "Which keyword defines a function?",
      "answers": [
        {
          "content": "def",
          "correct": true
        },
        {
          "content": "func",
          "correct": false
        }
      ]
    }
  ]
}
```

## Quiz Update

PUT `localhost:8000/api/quizzes2/1/`

e.g payload

```
{
  "title": "Python Basics",
  "description": "Intro quiz",
  "difficulty": "BEGINNER",
  "time": 1,
  "category": "Python",
  "questions": [
    {
      "content": "What is the output of print(2+2)?",
      "answers": [
        {"content": "3", "correct": false},
        {"content": "4", "correct": true},
        {"content": "5", "correct": false}
      ]
    },
    {
      "content": "Which keyword defines a function?",
      "answers": [
        {"content": "def", "correct": true},
        {"content": "func", "correct": false}
      ]
    }
  ]
}
```

__Response example__

```
{
  "id": 1,
  "title": "Python Basics",
  "description": "Intro quiz",
  "difficulty": "BEGINNER",
  "difficulty_display": "Beginner",
  "time": 2,
  "category": "Python"
}
```
