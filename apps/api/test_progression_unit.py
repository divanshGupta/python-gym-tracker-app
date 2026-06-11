from app.services.progression import analyze_progression, WorkoutSession
from datetime import date

def test_returns_insufficient_data_when_fewer_than_3_sessions():
    # arrange
    sessions = [
        WorkoutSession(date=date(2023, 1, 1), weight=100.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 2), weight=100.0, reps=8, sets=3, equipment="dumbbell"),
    ]

    # act
    result = analyze_progression(exercise_id=1, exercise_name="Test Exercise", sessions=sessions)

    # assert
    assert result.suggestion == "insufficient_data"

def test_returns_reduce_weight():
    # arrange
    sessions = [
        WorkoutSession(date=date(2023, 1, 1), weight=100.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 2), weight=100.0, reps=6, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 3), weight=90.0, reps=5, sets=3, equipment="dumbbell"),
    ]

    # act 
    result = analyze_progression(exercise_id=1, exercise_name="Heavy Exercise", sessions=sessions)

    # assert
    assert result.suggestion == "reduce_weight"

def test_returns_increase_weight():
    # arrange
    sessions = [
        WorkoutSession(date=date(2023, 1, 1), weight=110.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 2), weight=110.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 3), weight=110.0, reps=8, sets=3, equipment="dumbbell"),
    ]

    # act 
    result = analyze_progression(exercise_id=1, exercise_name="Progressing Exercise", sessions=sessions)

    # assert
    assert result.suggestion == "increase_weight"
    assert result.current_weight == 110.0
    assert result.suggested_weight == 112.0
    assert result.sessions_analyzed == len(sessions)

def test_returns_maintain():
    sessions = [
        WorkoutSession(date=date(2023, 1, 1), weight=100.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 2), weight=100.0, reps=8, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 3), weight=120.0, reps=8, sets=3, equipment="dumbbell"),
    ]

    # act
    result = analyze_progression(exercise_id=1, exercise_name="Stable Exercise", sessions=sessions) 

    # assert
    assert result.suggestion == "maintain"

def test_return_maintain_default():
    # arrange
    sessions = [
        WorkoutSession(date=date(2023, 1, 1), weight=100.0, reps=6, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 2), weight=100.0, reps=6, sets=3, equipment="dumbbell"),
        WorkoutSession(date=date(2023, 1, 3), weight=120.0, reps=6, sets=3, equipment="dumbbell"),
    ]

    # act
    result = analyze_progression(exercise_id=1, exercise_name="Default Exercise", sessions=sessions)

    # assert
    assert result.suggestion == "maintain"      