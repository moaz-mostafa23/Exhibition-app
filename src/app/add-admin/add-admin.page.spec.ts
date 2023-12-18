import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdminPage } from './add-admin.page';

describe('AddAdminPage', () => {
  let component: AddAdminPage;
  let fixture: ComponentFixture<AddAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
