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

  color: Array<any> = [
      '#D9D7F1',
      '#FFFDDE',
      '#E7FBBE',
      '#FFCBCB',
      '#FFEDDB',
      '#F7ECDE',
      '#F0ECE3',
      '#E6DF9A',
      '#F3ED9E',
      '#FFDCDC',
      '#FBF8F1',
      '#DFD3C3',
      '#EFEFEF',
      '#FFEFBC',
      '#D1E9D2',
      '#E5F4E7',
      '#F1FDF3'
  ]
  todoListCategories: Array<any> = []
  todoListTitleName: string = ''
  idForUpdatingTodoTitle:string=''
  buttonName: string = 'Add'
  randomNumberForColor:number=0


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
    //  this.randomNumberForColor++
    //  if(this.randomNumberForColor === this.color.length){
    //   this.randomNumberForColor = 0
    //  }
    //   console.log("this.randomNumberForColor",this.randomNumberForColor)
      let todoCategory = {
        category: formData.value.todolistName,
        colorcode: this.color[randomNumberForColor],
        todocount: 0,
        timestamp: new Date()
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
    this.router.navigate(['/todo',id])
  }


}
