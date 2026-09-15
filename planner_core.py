from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List

STATE_FILE = Path(__file__).resolve().with_name("state.json")
SPRINT_STATUSES = ["Planning", "Active", "Completed"]
RETROSPECTIVE_CATEGORIES = ["Went Well", "To Improve", "Action Item"]


@dataclass
class Sprint:
    name: str
    status: str = "Planning"
    task_ids: List[str] = field(default_factory=list)
    id: str = ""

    def __post_init__(self) -> None:
        if not self.name or not self.name.strip():
            raise ValueError("Sprint name cannot be empty.")
        if self.status not in SPRINT_STATUSES:
            raise ValueError(f"Invalid sprint status: {self.status}")
        self.name = self.name.strip()
        self.task_ids = [str(task_id).strip() for task_id in self.task_ids if str(task_id).strip()]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "task_ids": self.task_ids,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Sprint":
        return cls(
            id=data.get("id", ""),
            name=data.get("name", ""),
            status=data.get("status", "Planning"),
            task_ids=data.get("task_ids", []),
        )


@dataclass
class RetrospectiveCard:
    sprint_id: str
    category: str
    text: str
    id: str = ""

    def __post_init__(self) -> None:
        if not self.sprint_id or not self.sprint_id.strip():
            raise ValueError("Retrospective card must belong to a sprint.")
        if self.category not in RETROSPECTIVE_CATEGORIES:
            raise ValueError(f"Invalid retrospective category: {self.category}")
        if not self.text or not self.text.strip():
            raise ValueError("Retrospective text cannot be empty.")
        self.sprint_id = self.sprint_id.strip()
        self.text = self.text.strip()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sprint_id": self.sprint_id,
            "category": self.category,
            "text": self.text,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "RetrospectiveCard":
        return cls(
            id=data.get("id", ""),
            sprint_id=data.get("sprint_id", ""),
            category=data.get("category", "Went Well"),
            text=data.get("text", ""),
        )


@dataclass
class PlannerState:
    sprints: List[Sprint] = field(default_factory=list)
    retrospective_cards: List[RetrospectiveCard] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "sprints": [sprint.to_dict() for sprint in self.sprints],
            "retrospective_cards": [card.to_dict() for card in self.retrospective_cards],
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PlannerState":
        return cls(
            sprints=[Sprint.from_dict(item) for item in data.get("sprints", [])],
            retrospective_cards=[RetrospectiveCard.from_dict(item) for item in data.get("retrospective_cards", [])],
        )


def load_state(file_path: Path = STATE_FILE) -> PlannerState:
    if not file_path.exists():
        empty_state = PlannerState()
        save_state(empty_state, file_path)
        return empty_state

    with file_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("State file must contain a JSON object.")

    return PlannerState.from_dict(data)


def save_state(state: PlannerState, file_path: Path = STATE_FILE) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with file_path.open("w", encoding="utf-8") as file:
        json.dump(state.to_dict(), file, indent=2)
        file.write("\n")


def find_sprint(state: PlannerState, sprint_id: str) -> Sprint:
    for sprint in state.sprints:
        if sprint.id == sprint_id:
            return sprint
    raise ValueError(f"Sprint with id '{sprint_id}' was not found.")


def create_sprint(state: PlannerState, name: str) -> Sprint:
    if not name or not name.strip():
        raise ValueError("Sprint name cannot be empty.")

    sprint_id = f"sprint-{len(state.sprints) + 1}"
    sprint = Sprint(id=sprint_id, name=name, status="Planning", task_ids=[])
    state.sprints.append(sprint)
    return sprint


def start_sprint(state: PlannerState, sprint_id: str) -> Sprint:
    sprint = find_sprint(state, sprint_id)
    if sprint.status != "Planning":
        raise ValueError(f"Sprint '{sprint_id}' cannot be started because it is not in Planning state.")

    sprint.status = "Active"
    return sprint


def add_task_to_sprint(state: PlannerState, sprint_id: str, task_id: str) -> Sprint:
    sprint = find_sprint(state, sprint_id)
    if sprint.status != "Active":
        raise ValueError(f"Tasks can only be added to an Active sprint. Current status: {sprint.status}")

    task_id = str(task_id).strip()
    if not task_id:
        raise ValueError("Task ID cannot be empty.")

    if task_id not in sprint.task_ids:
        sprint.task_ids.append(task_id)

    return sprint


def complete_sprint(state: PlannerState, sprint_id: str) -> Sprint:
    sprint = find_sprint(state, sprint_id)
    if sprint.status != "Active":
        raise ValueError(f"Sprint '{sprint_id}' cannot be completed because it is not Active.")

    sprint.status = "Completed"
    return sprint


def add_retrospective_card(state: PlannerState, sprint_id: str, category: str, text: str) -> RetrospectiveCard:
    sprint = find_sprint(state, sprint_id)
    if sprint.status != "Completed":
        raise ValueError("Retrospective cards can only be added to a Completed sprint.")

    category = category.strip()
    text = text.strip()
    if category not in RETROSPECTIVE_CATEGORIES:
        raise ValueError(f"Invalid category. Allowed values: {RETROSPECTIVE_CATEGORIES}")
    if not text:
        raise ValueError("Retrospective text cannot be empty.")

    card = RetrospectiveCard(
        id=f"card-{len(state.retrospective_cards) + 1}",
        sprint_id=sprint_id,
        category=category,
        text=text,
    )
    state.retrospective_cards.append(card)
    return card


def main() -> None:
    state = load_state()

    print("Planner Core loaded from", STATE_FILE)
    print(json.dumps(state.to_dict(), indent=2))

    sprint_one = create_sprint(state, "Sprint 1")
    start_sprint(state, sprint_one.id)
    add_task_to_sprint(state, sprint_one.id, "task-101")
    add_task_to_sprint(state, sprint_one.id, "task-102")
    complete_sprint(state, sprint_one.id)
    add_retrospective_card(state, sprint_one.id, "Went Well", "The team finished planning early and aligned on scope.")
    add_retrospective_card(state, sprint_one.id, "To Improve", "We should reduce context switching during implementation.")

    sprint_two = create_sprint(state, "Sprint 2")
    start_sprint(state, sprint_two.id)
    add_task_to_sprint(state, sprint_two.id, "task-201")

    save_state(state)
    print("\nUpdated planner state saved to disk.")
    print(json.dumps(state.to_dict(), indent=2))


if __name__ == "__main__":
    main()
