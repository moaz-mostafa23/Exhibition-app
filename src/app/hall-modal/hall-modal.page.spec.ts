import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallModalPage } from './hall-modal.page';

describe('HallModalPage', () => {
  let component: HallModalPage;
  let fixture: ComponentFixture<HallModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HallModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
