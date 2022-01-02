import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from '../../services/ui.service';
import { Subject, takeUntil } from 'rxjs';

import { Task } from '../../Task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit, OnDestroy {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  forms = new FormGroup({
    text: new FormControl(null, Validators.required),
    day: new FormControl(null, Validators.required),
    reminder: new FormControl(false, Validators.required),
  });

  showAddTask: boolean = false;
  destroy = new Subject();

  private _submitted = false;

  get submitted(): boolean {
    return this._submitted;
  }

  get textControl(): FormControl {
    return this.forms.controls['text'] as FormControl;
  }
  constructor(private uiService: UiService) {}
  ngOnDestroy(): void {
    this.destroy.next(undefined);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.uiService
      .onToggle()
      .pipe(takeUntil(this.destroy))
      .subscribe((task) => (this.showAddTask = task));
  }
  onSubmit(): void {
    this._submitted = true;

    const newTask = {
      text: this.forms.controls['text'].value,
      day: this.forms.controls['day'].value,
      reminder: this.forms.controls['reminder'].value,
    };

    this.onAddTask.emit(newTask);
    this._submitted = false;
    this.forms.reset();
  }
}
