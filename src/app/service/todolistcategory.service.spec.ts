import { TestBed } from '@angular/core/testing';

import { TodolistcategoryService } from './todolistcategory.service';

describe('TodolistcategoryService', () => {
  let service: TodolistcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
