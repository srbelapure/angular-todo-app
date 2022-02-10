import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { TodolistService } from '../service/todolist.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  todoListCategoryId: string = '';
  todoitemvalue: string = ''
  paramsSubscription: Subscription;
  categoryTodoItemsList: Array<any> = [];
  buttonName: string = 'Add';
  idForUpdatingTodoItem: string = '';
  // completedTodoItem
  isTodoItemChecked:boolean=false


  constructor(private route: ActivatedRoute,
    private todolistService: TodolistService) { }

  ngOnInit(): void {
    /**
     * snapshot only gets the initial value of the parameter map with this technique. 
     * Use the observable paramMap approach if there's a possibility that the router could re-use the component
     */
    //this.todoListCategoryId = this.route.snapshot.paramMap.get('id') as string


    //this.todoListCategoryId = this.route.snapshot.params['id'] // this remains static

    //this becomes dynamic, here subscription is to be handled
    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.todoListCategoryId = params['id']
      }
    )

    this.todolistService.getListOfTodoItems(this.todoListCategoryId).subscribe((listItems) => {
      console.log("listItems", listItems)
      this.categoryTodoItemsList = listItems
    })
  }

  onAddItemToList(formData: NgForm) {
    if (this.buttonName === 'Add') {
      let todoItemData = {
        todo: formData.value.todoItemText,
        iscompleted: false
      }
      this.todolistService.saveTodoList(this.todoListCategoryId, todoItemData)
    }
    else if (this.buttonName === 'Edit') {
      this.todolistService.updateTodoItem(this.todoListCategoryId, this.idForUpdatingTodoItem, this.todoitemvalue)
      this.buttonName = 'Add'
    }

    formData.reset()
  }

  onEditTodoItem(itemValue: string, id: string) {
    this.buttonName = 'Edit'
    this.todoitemvalue = itemValue
    this.idForUpdatingTodoItem = id
    console.log('id***', id)
  }

  onDeleteTodoItem(id: string) {
    this.todolistService.deleteTodoItem(this.todoListCategoryId, id)
  }

  onCompleteAction() {

  }

  onIncompleteAction() {

  }

  // ontodoItemChange(e: any) {
  //   console.log('##############', e.target.checked, e.target.value, e.target.name)

  //   this.isTodoItemChecked = e.target.checked
  // }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe()
  }

}
