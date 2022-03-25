import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            RouterTestingModule, // whenever we use 'private router:Router' in our .ts file we need to import RouterTestingModule
          ],
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  });

  it('should create the header', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('header should have a title of Todo App', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.debugElement.nativeElement.querySelector('.row .brand').innerHTML
    expect(component).toEqual('Todo App')
  });

  it('button click event should trigger onClickLogo ', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'onClickLogo');
    let btn = fixture.debugElement.query(By.css('.row .brand'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(component.onClickLogo).toHaveBeenCalled();
  }));

  it('when the onClickLogo event is triggered user should be navigated to home page',fakeAsync(()=>{
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'onClickLogo');
    let btn = fixture.debugElement.query(By.css('.row .brand'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(component.onClickLogo).toHaveBeenCalled();
    const location: Location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  }))
});
