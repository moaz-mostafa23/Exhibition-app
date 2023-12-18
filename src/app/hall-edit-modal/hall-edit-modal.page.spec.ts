import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallEditModalPage } from './hall-edit-modal.page';

describe('HallEditModalPage', () => {
  let component: HallEditModalPage;
  let fixture: ComponentFixture<HallEditModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HallEditModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
