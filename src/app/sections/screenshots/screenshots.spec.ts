import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Screenshots } from './screenshots';

describe('Screenshots', () => {
  let component: Screenshots;
  let fixture: ComponentFixture<Screenshots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Screenshots],
    }).compileComponents();

    fixture = TestBed.createComponent(Screenshots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
