import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TodolistcategoryService } from '../service/todolistcategory.service';

@Component({
  selector: 'app-todo-categories',
  templateUrl: './todo-categories.component.html',
  styleUrls: ['./todo-categories.component.css']
})
export class TodoCategoriesComponent implements OnInit {

  color: Array<any> = ['#632626', '#9D5353', '#BF8B67', '#DACC96', '#95CD41', '#FF7F3F', '#EA5C2B', '#99A799', '#E2C2B9', '#91091E', '#BECA5C', '#EF8D32', '#CC561E', '#AA2B1D', '#534E52', '#965D62', '#C7956D', '#F2D974', '#F6AE99']
  todoListCategories: Array<any> = []
  todoListTitleName: string = ''
  idForUpdatingTodoTitle:string=''
  buttonName: string = 'Add'


  constructor(private todolistCatService: TodolistcategoryService,
    private router:Router) { }

  ngOnInit(): void {
    this.todolistCatService.getTodoListsCategories().subscribe(item => {
      this.todoListCategories = item
    })
  }

  onAddTitleToCategory(formData: NgForm) {
    if (this.buttonName === 'Add') {
      /*If we are adding new Todo list name,then enter if loop*/

      //generate a random number between 0 to length of color array to select a color from array randomly
      let randomNumberForColor = Math.floor(Math.random() * this.color.length)
      let todoCategory = {
        category: formData.value.todolistName,
        colorcode: this.color[randomNumberForColor],
        todocount: 0
      }
      this.todolistCatService.saveTodoListTitle(todoCategory)
    }
    else if (this.buttonName === 'Edit') {
      this.todolistCatService.updateTodoListTitleName(this.todoListTitleName, this.idForUpdatingTodoTitle)
      this.buttonName = 'Add'
    }
    formData.reset()
  }

  editTodoListTitle(title: string, id: string) {
    this.buttonName = 'Edit'
    this.todoListTitleName = title
    this.idForUpdatingTodoTitle = id
  }

  deleteTodoList(id:string,listTitle:string){
    this.todolistCatService.deleteTodoListCategory(id,listTitle)
  }

  onSelectTodoList(id:string){
    alert(id)
    this.router.navigate(['/todo',id])
  }


}
