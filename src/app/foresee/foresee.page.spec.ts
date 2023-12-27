import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForeseePage } from './foresee.page';

describe('ForeseePage', () => {
  let component: ForeseePage;
  let fixture: ComponentFixture<ForeseePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForeseePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
