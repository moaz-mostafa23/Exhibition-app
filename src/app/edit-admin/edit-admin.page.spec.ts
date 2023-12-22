import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAdminPage } from './edit-admin.page';

describe('EditAdminPage', () => {
  let component: EditAdminPage;
  let fixture: ComponentFixture<EditAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
