import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  title: string = 'Task Manager';
  showAddTask: boolean = false;
  destroy = new Subject();

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

  toggleAddTask() {
    this.uiService.toggleAddTask();
  }
}
