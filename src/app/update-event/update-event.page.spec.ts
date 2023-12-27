import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEventPage } from './update-event.page';

describe('UpdateEventPage', () => {
  let component: UpdateEventPage;
  let fixture: ComponentFixture<UpdateEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
