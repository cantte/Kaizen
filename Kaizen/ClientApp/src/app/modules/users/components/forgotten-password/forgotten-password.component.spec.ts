import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { ForgottenPasswordComponent } from './forgotten-password.component';

describe('ForgottenPasswordComponent', () => {
  let component: ForgottenPasswordComponent;
  let fixture: ComponentFixture<ForgottenPasswordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule, RouterTestingModule, SharedModule ],
        declarations: [ ForgottenPasswordComponent ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgottenPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
