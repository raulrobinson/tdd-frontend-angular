import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Task {
  text: string;
  completed: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements AfterViewInit {
  newTask: string = '';
  tasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';

  @ViewChildren('editInput') editInputs!: QueryList<ElementRef>;

  constructor(private snackBar: MatSnackBar) {
    const saved = localStorage.getItem('tasks');
    if (saved) this.tasks = JSON.parse(saved);
  }

  ngAfterViewInit() {
    this.editInputs.changes.subscribe(() => {
      this.editInputs.forEach((input) => {
        if (input.nativeElement.dataset.focus === 'true') {
          input.nativeElement.focus();
          input.nativeElement.select();
          input.nativeElement.removeAttribute('data-focus');
        }
      });
    });
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask() {
    const text = this.newTask.trim();
    if (text) {
      this.tasks.push({ text, completed: false });
      this.newTask = '';
      this.saveTasks();
      this.showMessage('Tarea agregada');
    }
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
  }

  removeTask(index: number) {
    const deleted = this.tasks[index].text;
    this.tasks.splice(index, 1);
    this.saveTasks();
    this.showMessage(`Tarea eliminada: "${deleted}"`);
  }

  filteredTasks(): Task[] {
    switch (this.filter) {
      case 'completed': return this.tasks.filter(t => t.completed);
      case 'pending': return this.tasks.filter(t => !t.completed);
      default: return this.tasks;
    }
  }

  editTask(task: Task) {
    task.editing = true;
    setTimeout(() => this.saveTasks());
  }

  saveEdit(task: Task, newText: string) {
    const original = task.text;
    task.text = newText.trim() || task.text;
    task.editing = false;
    this.saveTasks();
    this.showMessage(`Tarea actualizada`);
  }

  completeTask(index: number) {
    this.tasks[index].completed = true;
    this.tasks[index].editing = false;
    this.saveTasks();
    this.showMessage('Tarea completada');
  }

  cancelEdit(task: Task) {
    task.editing = false;
  }

  showMessage(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  unlockTask(index: number) {
    this.tasks[index].completed = false;
    this.saveTasks();
    this.showMessage('Tarea desbloqueada');
  }

}
