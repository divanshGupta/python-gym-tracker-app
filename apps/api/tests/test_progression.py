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
