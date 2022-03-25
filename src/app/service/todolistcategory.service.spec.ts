import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';

import { FaketestTodolistCatService, TodolistcategoryService } from './todolistcategory.service';

// const input = [
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

describe('TodolistcategoryService', () => {
  let service: TodolistcategoryService;
//   let angularFirestore: AngularFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            { provide: TodolistcategoryService, useClass:FaketestTodolistCatService },
            // { provide: AngularFirestore, useValue: angularFiresotreStub }
          ]
    });
    service = TestBed.inject(TodolistcategoryService);
    // angularFirestore = TestBed.inject(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
