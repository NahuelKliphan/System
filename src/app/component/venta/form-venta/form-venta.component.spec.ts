import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVentaComponent } from './form-venta.component';

describe('FormVentaComponent', () => {
  let component: FormVentaComponent;
  let fixture: ComponentFixture<FormVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
