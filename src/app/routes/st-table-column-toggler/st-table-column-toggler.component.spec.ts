import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StTableColumnTogglerComponent } from './st-table-column-toggler.component';

describe('StTableColumnTogglerComponent', () => {
  let component: StTableColumnTogglerComponent;
  let fixture: ComponentFixture<StTableColumnTogglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StTableColumnTogglerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StTableColumnTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
