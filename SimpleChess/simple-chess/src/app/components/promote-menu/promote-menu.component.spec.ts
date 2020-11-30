import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteMenuComponent } from './promote-menu.component';

describe('PromoteMenuComponent', () => {
  let component: PromoteMenuComponent;
  let fixture: ComponentFixture<PromoteMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
