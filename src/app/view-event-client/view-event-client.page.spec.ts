import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventClientPage } from './view-event-client.page';

describe('ViewEventClientPage', () => {
  let component: ViewEventClientPage;
  let fixture: ComponentFixture<ViewEventClientPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewEventClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
