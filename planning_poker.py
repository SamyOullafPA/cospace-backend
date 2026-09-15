import random
from statistics import mean

FIBONACCI = [1, 2, 3, 5, 8, 13]
DEVELOPERS = ["Alice", "Ben", "Cara"]


def prompt_for_vote(developer_name: str, task_title: str) -> int:
    print(f"\n{developer_name}, please vote for '{task_title}'.")
    print("Available values:", FIBONACCI)

    while True:
        try:
            vote = input("Enter your estimate: ").strip()
            value = int(vote)
            if value in FIBONACCI:
                return value
            print("Invalid vote. Please choose a value from the Fibonacci sequence.")
        except ValueError:
            print("Please enter a valid integer.")


def calculate_average(votes: list[int]) -> float:
    return round(mean(votes), 2)


def suggest_consensus(votes: list[int]) -> int:
    average = calculate_average(votes)
    closest = min(FIBONACCI, key=lambda value: abs(value - average))
    return closest


def run_session(task_title: str) -> None:
    print(f"\n=== Planning Poker: {task_title} ===")
    votes = {}

    for developer in DEVELOPERS:
        votes[developer] = prompt_for_vote(developer, task_title)

    print("\nVotes received:")
    for developer, vote in votes.items():
        print(f"- {developer}: {vote}")

    avg = calculate_average(list(votes.values()))
    recommended = suggest_consensus(list(votes.values()))

    print(f"\nAverage estimate: {avg}")
    print(f"Suggested consensus vote: {recommended}")

    if len(set(votes.values())) == 1:
        print("Consensus reached: everyone voted the same.")
    else:
        print("Discussion still recommended to align the team.")

def is_ready_for_sprint(task: dict) -> bool:
    """
    Check if a task is ready to be pulled into a sprint by validating its Definition of Ready (DoR).
    """
    if not isinstance(task, dict):
        return False

    required_fields = {
        "title": str,
        "description": str,
        "story_points": (int, float),
        "blocked": bool,
        "dor_checklist": dict,
    }

    for field_name, expected_type in required_fields.items():
        if field_name not in task:
            return False
        if not isinstance(task[field_name], expected_type):
            return False

    if task["blocked"]:
        return False

    dor = task["dor_checklist"]

    required_dor_checks = {
        "clear_acceptance_criteria": bool,
        "dependencies_identified": bool,
        "estimate_confirmed": bool,
    }

    for check_name, expected_type in required_dor_checks.items():
        if check_name not in dor:
            return False
        if not isinstance(dor[check_name], expected_type):
            return False
        if not dor[check_name]:
            return False

    return True


def can_close_task(task: dict) -> bool:
    """
    Check if a task is ready to be closed by validating its Definition of Done (DoD).
    """
    if not isinstance(task, dict):
        return False

    if "dod_checklist" not in task or not isinstance(task["dod_checklist"], dict):
        return False

    dod = task["dod_checklist"]

    required_dod_checks = {
        "tested": bool,
        "reviewed": bool,
        "documented": bool,
    }

    for check_name, expected_type in required_dod_checks.items():
        if check_name not in dod:
            return False
        if not isinstance(dod[check_name], expected_type):
            return False
        if not dod[check_name]:
            return False

    return True

def main() -> None:
    print("Planning Poker CLI")
    print("Three developers will vote on a task using Fibonacci values.")

    task_title = input("Enter the task/story title: ").strip() or "New Story"
    run_session(task_title)


if __name__ == "__main__":
    main()
