# apps/api/app/services/progression.py
from dataclasses import dataclass
from datetime import date
from math import isclose
from typing import Literal

# ── Types ─────────────────────────────────────────────────────────────────────

Suggestion = Literal[
    "increase_weight",
    "maintain",
    "reduce_weight",
    "insufficient_data",
]

@dataclass
class WorkoutSession:
    date: date
    weight: float
    reps: int
    sets: int
    equipment: str

@dataclass
class ProgressionResult:
    exercise_id: int
    exercise_name: str
    sessions_analyzed: int
    suggestion: Suggestion
    suggestion_text: str
    current_weight: float
    suggested_weight: float

# ── Constants ─────────────────────────────────────────────────────────────────

MIN_SESSIONS = 3
REP_TARGET = 8        # reps needed before suggesting weight increase
STRUGGLE_THRESHOLD = 5  # reps at or below this = struggling

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_weight_increment(equipment: str) -> float:
    """Standard progression increment per equipment type."""
    return 2.0 if equipment == "dumbbell" else 2.5

def weights_equal(a: float, b: float) -> bool:
    """Float-safe weight comparison."""
    return isclose(a, b, rel_tol=1e-9)

def build_suggestion_text(result: ProgressionResult) -> str:
    """Human-readable suggestion based on analysis result."""
    if result.suggestion == "increase_weight":
        return (
            f"You've been consistent at {result.current_weight}kg across "
            f"{result.sessions_analyzed} sessions. "
            f"Try {result.suggested_weight}kg next session."
        )
    if result.suggestion == "reduce_weight":
        return (
            f"You may be struggling at {result.current_weight}kg. "
            f"Consider dropping to {result.suggested_weight}kg next session "
            f"to rebuild confidence and form."
        )
    if result.suggestion == "maintain":
        return (
            f"Keep training at {result.current_weight}kg. "
            f"Focus on hitting {REP_TARGET} reps consistently before increasing load."
        )
    # insufficient_data
    return (
        f"Not enough data yet — need at least {MIN_SESSIONS} sessions. "
        f"Keep logging your workouts."
    )

# ── Core algorithm ────────────────────────────────────────────────────────────

def analyze_progression(
    exercise_id: int,
    exercise_name: str,
    sessions: list[WorkoutSession],
) -> ProgressionResult:
    """
    Analyze workout sessions for a single exercise and return a progression suggestion.

    Expects sessions to be pre-fetched for the correct user and exercise.
    Sorting is handled internally.
    """

    def make_result(
        suggestion: Suggestion,
        current_weight: float,
        suggested_weight: float,
    ) -> ProgressionResult:
        """Build a ProgressionResult and attach suggestion text in one step."""
        result = ProgressionResult(
            exercise_id=exercise_id,
            exercise_name=exercise_name,
            sessions_analyzed=len(sessions),
            suggestion=suggestion,
            suggestion_text="",
            current_weight=current_weight,
            suggested_weight=suggested_weight,
        )
        result.suggestion_text = build_suggestion_text(result)
        return result

    # ── Insufficient data ────────────────────────────────────────────────────
    if len(sessions) < MIN_SESSIONS:
        current = sessions[-1].weight if sessions else 0.0
        return make_result("insufficient_data", current, current)

    # ── Sort: most recent first ──────────────────────────────────────────────
    sorted_sessions = sorted(sessions, key=lambda s: s.date, reverse=True)
    latest, previous, older = sorted_sessions[0], sorted_sessions[1], sorted_sessions[2]
    increment = get_weight_increment(latest.equipment)

    # ── Struggling: reps too low ─────────────────────────────────────────────
    if latest.reps <= STRUGGLE_THRESHOLD:
        suggested = max(0.0, latest.weight - increment)
        return make_result("reduce_weight", latest.weight, suggested)

    # ── Recently increased weight: still adapting ────────────────────────────
    if not weights_equal(latest.weight, previous.weight):
        return make_result("maintain", latest.weight, latest.weight)

    # ── Consistent weight + hitting rep target: ready to progress ────────────
    all_same_weight = (
        weights_equal(latest.weight, previous.weight)
        and weights_equal(previous.weight, older.weight)
    )
    all_hitting_target = (
        latest.reps >= REP_TARGET
        and previous.reps >= REP_TARGET
        and older.reps >= REP_TARGET
    )
    if all_same_weight and all_hitting_target:
        return make_result("increase_weight", latest.weight, latest.weight + increment)

    
    # ── Default: keep working at current weight ──────────────────────────────
    return make_result("maintain", latest.weight, latest.weight)