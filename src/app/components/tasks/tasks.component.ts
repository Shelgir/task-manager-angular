import { Component, OnDestroy, OnInit } from '@angular/core';
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task } from '../../Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  _tasks: Task[] | undefined;
  private _hasError = false;

  private destroy$ = new Subject();

  get tasks(): Task[] {
    return this._tasks ?? [];
  }
  get hasError(): boolean {
    return this._hasError;
  }
  constructor(private taskService: TaskService) {}

  //#region Functions

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => (this._tasks = tasks));
  }

  async deleteTask(task: Task): Promise<void> {
    this._hasError = false;
    try {
      await firstValueFrom(this.taskService.deleteTask(task));
      this._tasks = this._tasks?.filter((t) => t.id !== task?.id);
    } catch {
      this._hasError = true;
    }
  }

  async toggleReminder(task: Task) {
    task.reminder = !task.reminder;
    try {
      await firstValueFrom(this.taskService.updateTaskReminder(task));
    } catch {}
  }

  async addTask(task: Task) {
    firstValueFrom(this.taskService.addTask(task));
    this._tasks?.push(task);
  }
  //#endregion
}
