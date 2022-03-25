import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TodoCategoriesComponent } from './todo-categories.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { FaketestTodolistCatService, TodolistcategoryService } from '../service/todolistcategory.service';
import { FormsModule } from '@angular/forms';

describe('TodoCategoriesComponent', () => {
  let component: TodoCategoriesComponent;
  let fixture: ComponentFixture<TodoCategoriesComponent>;


//   const input = [
//     { id:'1',category: 'eat', colorcode: '#F1FDF3', newlycreatedcategory: true,timestamp:Math.floor(Date.now() / 1000),todocount:'2'},
//     { id:'2',category: 'drink', colorcode: '#F1FDF8', newlycreatedcategory: false,timestamp:Math.floor(Date.now() / 1000),todocount:'6'},
//     { id:'3',category: 'sleep', colorcode: '#F1FFF3', newlycreatedcategory: true,timestamp:Math.floor(Date.now() / 1000),todocount:'9'},
//     { id:'4',category: 'exercise', colorcode: '#F1FDE3', newlycreatedcategory: false,timestamp:Math.floor(Date.now() / 1000),todocount:'8'},
//   ];
  
//   const data = from(input);
  
//   const collectionStub = {
//     valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data)
//   }
  
//   const angularFiresotreStub = {
//     collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
//   }

//   const FirestoreStub = {
//     collection: (name: string) => ({
//       doc: (_id: string) => ({
//         valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
//         set: (_d: any) => new Promise<void>((resolve, _reject) => resolve()),
//       }),
//     }),
//   };

   const toastrService = {
    success: (
      message?: string,
      title?: string,
      override?: Partial<any>
    ) => {},
    error: (
      message?: string,
      title?: string,
      override?: Partial<any>
    ) => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            FormsModule
          ],
          providers: [
            { provide: TodolistcategoryService, useClass:FaketestTodolistCatService },
            // { provide: AngularFirestore, useValue: FirestoreStub },
            // { provide: AngularFirestore, useValue: angularFiresotreStub },
              { provide: ToastrService, useValue: toastrService }
          ],
      declarations: [ TodoCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the todo-categories component', () => {
    let comp = fixture.debugElement.nativeElement.querySelector('.row p').innerHTML
    expect(comp.trim()).toEqual('Orgainze your routine with a Todo List');
  });
});
