from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

STATE_PATH = Path(__file__).resolve().with_name("state.json")

VALID_FIBONACCI = {1, 2, 3, 5, 8, 13}
VALID_SPRINT_STATUSES = {"Planning", "Active", "Completed"}
VALID_RETRO_CATEGORIES = {"Went Well", "To Improve", "Action Item"}
REQUIRED_DOR_FIELDS = [
    "clear_acceptance_criteria",
    "dependencies_identified",
    "estimate_confirmed",
]
REQUIRED_DOD_FIELDS = [
    "tested",
    "reviewed",
    "documented",
]


def validate_story_points(story_points: Any) -> int:
    """Ensure a story point estimate is in the allowed Fibonacci set."""
    if not isinstance(story_points, int) or story_points not in VALID_FIBONACCI:
        raise ValueError(
            "Invalid story points. Allowed values are 1, 2, 3, 5, 8, or 13."
        )
    return story_points


def validate_blocker(task: Dict[str, Any]) -> None:
    """Reject invalid blocked metadata."""
    blocked = task.get("blocked")
    blocker_reason = task.get("blocker_reason", "")

    if blocked is not True and blocked is not False:
        raise ValueError("Task 'blocked' must be a boolean.")

    if blocked and not isinstance(blocker_reason, str):
        raise ValueError("Task blocker_reason must be a string when blocked is true.")

    if not blocked and blocker_reason.strip():
        raise ValueError("blocker_reason must be cleared before unblocking a task.")


def validate_dor(task: Dict[str, Any]) -> bool:
    """Check the Definition of Ready gate for moving a task into a sprint."""
    if task.get("story_points", 0) <= 0:
        raise ValueError("Task must have a story point value greater than zero before sprinting.")

    dor = task.get("dor_checklist")
    if not isinstance(dor, dict):
        raise ValueError("Task is missing a valid dor_checklist.")

    for field_name in REQUIRED_DOR_FIELDS:
        if field_name not in dor or dor[field_name] is not True:
            raise ValueError(f"Task is not ready for sprint: DoR check '{field_name}' is not complete.")

    return True


def validate_dod(task: Dict[str, Any]) -> bool:
    """Check the Definition of Done gate before moving a task to Done."""
    dod = task.get("dod_checklist")
    if not isinstance(dod, dict):
        raise ValueError("Task is missing a valid dod_checklist.")

    for field_name in REQUIRED_DOD_FIELDS:
        if field_name not in dod or dod[field_name] is not True:
            raise ValueError(f"Task cannot be marked Done: DoD check '{field_name}' is not complete.")

    return True


def unblock_task(task: Dict[str, Any]) -> Dict[str, Any]:
    """Manually clear the blocked flag and blocker reason."""
    task["blocked"] = False
    task["blocker_reason"] = ""
    return task


def enforce_blocked_move(task: Dict[str, Any], target_status: str) -> None:
    """Block any move from a blocked task, especially to Done."""
    if task.get("blocked") is True:
        raise ValueError(
            f"Task '{task.get('title', 'Unknown')}' is blocked. Unblock it before moving it to '{target_status}'."
        )


def move_task_to_sprint(state: Dict[str, Any], task_id: str, sprint_id: str) -> Dict[str, Any]:
    """Move a task from backlog into an active sprint only if DoR is satisfied."""
    tasks = state["tasks"]
    task = next((item for item in tasks if item["id"] == task_id), None)
    if task is None:
        raise ValueError(f"Task '{task_id}' does not exist.")

    enforce_blocked_move(task, "Active Sprint")
    validate_dor(task)

    sprint = next((item for item in state["sprints"] if item["id"] == sprint_id), None)
    if sprint is None:
        raise ValueError(f"Sprint '{sprint_id}' does not exist.")

    if sprint.get("status") != "Active":
        raise ValueError("Only an Active sprint can receive new tasks.")

    task["status"] = "In Sprint"
    task["sprint_id"] = sprint_id
    if task_id not in sprint["taskIds"]:
        sprint["taskIds"].append(task_id)

    return task


def move_task_to_done(state: Dict[str, Any], task_id: str) -> Dict[str, Any]:
    """Move a task to Done only when all DoD checks are complete and it is not blocked."""
    tasks = state["tasks"]
    task = next((item for item in tasks if item["id"] == task_id), None)
    if task is None:
        raise ValueError(f"Task '{task_id}' does not exist.")

    enforce_blocked_move(task, "Done")
    validate_dod(task)

    task["status"] = "Done"
    return task


def start_sprint(state: Dict[str, Any], sprint_id: str) -> Dict[str, Any]:
    """Set a sprint to Active only if no other sprint is already active."""
    sprint = next((item for item in state["sprints"] if item["id"] == sprint_id), None)
    if sprint is None:
        raise ValueError(f"Sprint '{sprint_id}' does not exist.")

    active_sprint = next((item for item in state["sprints"] if item["status"] == "Active"), None)
    if active_sprint and active_sprint["id"] != sprint_id:
        raise ValueError(f"A sprint is already active: '{active_sprint['name']}'. Only one Active sprint is allowed.")

    sprint["status"] = "Active"
    return sprint


def complete_sprint(state: Dict[str, Any], sprint_id: str) -> Dict[str, Any]:
    """Complete a sprint and unassign unfinished tasks back to the backlog."""
    sprint = next((item for item in state["sprints"] if item["id"] == sprint_id), None)
    if sprint is None:
        raise ValueError(f"Sprint '{sprint_id}' does not exist.")

    if sprint["status"] == "Completed":
        raise ValueError("This sprint is already completed.")

    for task_id in list(sprint.get("taskIds", [])):
        task = next((item for item in state["tasks"] if item["id"] == task_id), None)
        if task is None:
            continue

        if task.get("status") != "Done":
            task["status"] = "Product Backlog"
            task["sprint_id"] = None
            sprint["taskIds"].remove(task_id)

    sprint["status"] = "Completed"
    return sprint


def add_retrospective_card(state: Dict[str, Any], sprint_id: str, category: str, text: str) -> Dict[str, Any]:
    """Only completed sprints can have retrospective cards, and only valid categories are accepted."""
    sprint = next((item for item in state["sprints"] if item["id"] == sprint_id), None)
    if sprint is None:
        raise ValueError(f"Sprint '{sprint_id}' does not exist.")

    if sprint["status"] != "Completed":
        raise ValueError("Retrospectives can only be added to a completed sprint.")

    if category not in VALID_RETRO_CATEGORIES:
        raise ValueError("Invalid retrospective category. Allowed values are: Went Well, To Improve, Action Item.")

    if not text.strip():
        raise ValueError("Retrospective text cannot be blank.")

    card = {
        "id": f"retro-{len(state['retrospectiveCards']) + 1}",
        "sprintId": sprint_id,
        "category": category,
        "text": text.strip(),
    }
    state["retrospectiveCards"].append(card)
    return card


def add_sprint(state: Dict[str, Any], name: str) -> Dict[str, Any]:
    """Create a sprint in the Planning state."""
    if not name.strip():
        raise ValueError("Sprint name cannot be empty.")

    sprint = {
        "id": f"sprint-{len(state['sprints']) + 1}",
        "name": name.strip(),
        "status": "Planning",
        "taskIds": [],
    }
    state["sprints"].append(sprint)
    return sprint


def create_task(task_id: str, title: str, story_points: int, blocked: bool = False, blocker_reason: str = "") -> Dict[str, Any]:
    """Create a valid task object with the required planning metadata."""
    validate_story_points(story_points)
    task = {
        "id": task_id,
        "title": title.strip(),
        "description": "",
        "status": "Product Backlog",
        "story_points": story_points,
        "blocked": blocked,
        "blocker_reason": blocker_reason.strip() if blocked else "",
        "sprint_id": None,
        "dor_checklist": {
            "clear_acceptance_criteria": False,
            "dependencies_identified": False,
            "estimate_confirmed": False,
        },
        "dod_checklist": {
            "tested": False,
            "reviewed": False,
            "documented": False,
        },
    }
    validate_blocker(task)
    return task


def load_state(path: Path = STATE_PATH) -> Dict[str, Any]:
    if not path.exists():
        default_state = {
            "sprints": [],
            "tasks": [],
            "retrospectiveCards": [],
        }
        save_state(default_state, path)
        return default_state

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("State file must contain a JSON object.")

    data.setdefault("sprints", [])
    data.setdefault("tasks", [])
    data.setdefault("retrospectiveCards", [])
    return data


def save_state(state: Dict[str, Any], path: Path = STATE_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(state, file, indent=2)
        file.write("\n")


if __name__ == "__main__":
    state = load_state()

    if not state["sprints"]:
        sprint = add_sprint(state, "Sprint 1")
        start_sprint(state, sprint["id"])

    task = create_task("task-1", "Build profile page", 5)
    task["dor_checklist"] = {
        "clear_acceptance_criteria": True,
        "dependencies_identified": True,
        "estimate_confirmed": True,
    }
    task["dod_checklist"] = {
        "tested": True,
        "reviewed": True,
        "documented": True,
    }
    state["tasks"].append(task)

    if state["sprints"]:
        active_sprint = next((item for item in state["sprints"] if item["status"] == "Active"), None)
        if active_sprint:
            move_task_to_sprint(state, task["id"], active_sprint["id"])
            move_task_to_done(state, task["id"])
            complete_sprint(state, active_sprint["id"])
            add_retrospective_card(state, active_sprint["id"], "Went Well", "The team collaborated effectively.")

    save_state(state)
    print(json.dumps(state, indent=2))
