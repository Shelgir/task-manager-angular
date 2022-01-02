import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Task } from '../../Task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  forms = new FormGroup({
    text: new FormControl(null, Validators.required),
    day: new FormControl(null, Validators.required),
    reminder: new FormControl(false, Validators.required),
  });

  private _submitted = false;

  get submitted(): boolean {
    return this._submitted;
  }

  get textControl(): FormControl {
    return this.forms.controls['text'] as FormControl;
  }
  constructor() {}

  ngOnInit(): void {}

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
