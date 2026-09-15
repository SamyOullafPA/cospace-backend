from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

# As an employee, I want to view available desks for a specific day so that I can choose a suitable place to work in the office.

# As an employee, I want to create a desk booking for a date so that I can reserve a workspace for myself.

# As an employee, I want to cancel a booking I no longer need so that I free up a desk for someone else.

# As a colleague, I want to see only my own bookings so that I can manage my schedule without affecting others.

# As an admin, I want to manage booking activity and ensure desk availability is accurate so that the office stays organised and avoids double-booking.

STATUSES = ["To Do", "In Progress", "Done"]

@dataclass
class Task:
    title: str
    description: str = ""
    status: str = "To Do"

    def __post_init__(self) -> None:
        if self.status not in STATUSES:
            raise ValueError(f"Invalid status: {self.status}")

    def move_next(self) -> None:
        current_index = STATUSES.index(self.status)
        if current_index < len(STATUSES) - 1:
            self.status = STATUSES[current_index + 1]

class KanbanBoard:
    def __init__(self) -> None:
        self.tasks: List[Task] = []

    def CheckDuplicates(self, title: str) -> bool:
        for task in self.tasks:
            if task.title == title:
                return True

        return False

    def add_task(self, title: str, description: str = "") -> Task:
        if (title == "" or self.CheckDuplicates(title)) == False:
            task = Task(title=title.strip(), description=description.strip())
            self.tasks.append(task)
            return task

    def move_task(self, title: str, steps: int = 1) -> bool:
        for task in self.tasks:
            if task.title.lower() == title.lower():
                current_index = STATUSES.index(task.status)
                new_index = min(current_index + steps, len(STATUSES) - 1)
                task.status = STATUSES[new_index]
                return True
        return False

    def display(self) -> None:
        print("\n=== Kanban Board ===")
        for status in STATUSES:
            print(f"\n## {status}")
            matching_tasks = [task for task in self.tasks if task.status == status]
            if not matching_tasks:
                print("(no tasks)")
                continue

            for task in matching_tasks:
                print(f"- {task.title}")
                if task.description:
                    print(f"  {task.description}")

    def help(self) -> None:
        print("\nCommands:")
        print("  add <title> [description]  - Add a task")
        print("  move <title>               - Move a task to the next column")
        print("  list                       - Show the board")
        print("  help                       - Show this help")
        print("  quit                       - Exit the app")


def main() -> None:
    board = KanbanBoard()
    board.add_task("Write project proposal", "Outline the project goals and scope")
    board.add_task("Build API", "Set up routes and data model")
    board.tasks[1].move_next()

    print("Kanban CLI")
    board.help()

    while True:
        command = input("\n> ").strip()

        if not command:
            continue

        parts = command.split(maxsplit=2)
        action = parts[0].lower()

        if action == "quit":
            print("Goodbye!")
            break

        if action == "help":
            board.help()
            continue

        if action == "list":
            board.display()
            continue

        if action == "add":
            if len(parts) < 2:
                print("Usage: add <title> [description]")
                continue

            title = parts[1]
            description = parts[2] if len(parts) > 2 else ""
            board.add_task(title, description)
            print(f"Added task: {title}")
            continue

        if action == "move":
            if len(parts) < 2:
                print("Usage: move <title>")
                continue

            title = parts[1]
            moved = board.move_task(title)
            if moved:
                print(f"Moved task: {title}")
            else:
                print(f"Task not found: {title}")
            continue

        print("Unknown command. Type 'help' for options.")


if __name__ == "__main__":
    main()