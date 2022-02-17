import { Component, ElementRef, OnInit , Renderer2, ViewChild, ViewChildren,QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  // buttonName: string = 'Add'
  randomNumberForColor:number=0
  dynamicItemFromQueryList:ElementRef
  editCategoryTitleMode:boolean=false
  queryListItems:Array<ElementRef>=[]
  getLatestSelectedElementFromArray:any
  isEnterKeyPressed:boolean=false
  anyKeyPressed:boolean=false

  @ViewChild('test', { static: false }) testchild: ElementRef;
  @ViewChildren('test') private test: QueryList<ElementRef>;


  constructor(private todolistCatService: TodolistcategoryService,
    private router:Router, 
    private el: ElementRef, 
      private renderer:Renderer2,
      private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.todolistCatService.getTodoListsCategories().subscribe(item => {
      this.todoListCategories = item
    })
  }

  onAddTitleToCategory(formData: NgForm) {
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
        timestamp: new Date(),
        newlycreatedcategory:true
      }
      this.todolistCatService.saveTodoListTitle(todoCategory)
    formData.reset()
  }

  editTodoListTitle(e:Event, title: string, id: string) {
    e.stopPropagation() //to allow editing of title and prevent page routing

    //this.buttonName = 'Edit'
    //this.todoListTitleName = title
    this.idForUpdatingTodoTitle = id
    this.createText(e,this.todoListTitleName,this.idForUpdatingTodoTitle,'')
  }

  deleteTodoList(e:Event,id:string,listTitle:string){
    e.stopPropagation() //to allow deleting of title and prevent page routing
    this.todolistCatService.deleteTodoListCategory(id,listTitle)
  }

  onSelectTodoList(id:string){
    this.router.navigate(['/todo',id])
  }

  createText(e:Event, title: string, id: string, color: string) {
    e.stopPropagation() //to allow editing of title and prevent page routing
    this.idForUpdatingTodoTitle = id

    let elements = this.test.toArray()
    elements.forEach(item => {
      if ('test' + id === item.nativeElement.id) {
        this.dynamicItemFromQueryList = item

       this.todoListTitleName = item.nativeElement.innerHTML.trim().replace(/&nbsp;/g, '');

        this.renderer.setAttribute(this.dynamicItemFromQueryList.nativeElement, 'contenteditable', 'true');
        this.renderer.setAttribute(this.dynamicItemFromQueryList.nativeElement, 'autofocus', 'true');
        this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'cursor', 'text');
        this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'background-color', color);
        this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'outline', 'none');
        this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'border', '1px solid');

        this.editCategoryTitleMode = true
      }
      else {
        this.renderer.removeAttribute(item.nativeElement, 'contenteditable' );
        this.renderer.removeStyle(item.nativeElement, 'border')
      }
    });

    window.addEventListener("keydown",(e:any)=>{
      this.anyKeyPressed = true
      if(e.keyCode === 32){
        //use this if loop and alter the if-else cases to prevent a success toaster on adding only spaces to an existing name
        this.anyKeyPressed = false
      }
    })
  }

  onEnterPress(e: any) {
    this.isEnterKeyPressed=true

    let istitleChanged = this.todoListTitleName.trim().replace(/&nbsp;/g, '') !== e.target.innerHTML.trim().replace(/&nbsp;/g, '') ? true : false

    this.todoListTitleName = e.target.innerHTML.trim().replace(/&nbsp;/g, '');

    this.renderer.removeAttribute(this.dynamicItemFromQueryList.nativeElement, 'contenteditable' );
    this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'border')
    this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'cursor')

    this.editCategoryTitleMode = false

    window.removeEventListener("blur",(e)=>{
      this.onSelectingNewTitle(e)
    })

    if (istitleChanged && this.anyKeyPressed) {
      this.todolistCatService.updateTodoListTitleName(this.todoListTitleName, this.idForUpdatingTodoTitle)
      this.isEnterKeyPressed=false
    }
    else{
      this.toastrService.warning('Category title is same as earlier title')
      this.renderer.setProperty(this.dynamicItemFromQueryList.nativeElement, 'innerHTML', this.todoListTitleName.trim().replace(/&nbsp;/g, ''));
      this.isEnterKeyPressed=false
    }

  }


  onSelectingNewTitle(e: any) {
    let istitleChanged = this.todoListTitleName.trim().replace(/&nbsp;/g, '') !== e.target.innerHTML.trim().replace(/&nbsp;/g, '') ? true : false
    if(!this.isEnterKeyPressed){
      this.isEnterKeyPressed = false
      let confirmBox = confirm('your current title changes are not saved.\nPress OK to save the changes or Cancel to exit the changes')
      if (confirmBox) {
        this.editCategoryTitleMode = false
        this.todoListTitleName = e.target.innerHTML.trim().replace(/&nbsp;/g, '');
        this.renderer.removeAttribute(this.dynamicItemFromQueryList.nativeElement, 'contenteditable' );
        this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'border')
        this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'cursor')
        if (istitleChanged && this.anyKeyPressed) {
          this.todolistCatService.updateTodoListTitleName(this.todoListTitleName, this.idForUpdatingTodoTitle)
        }
        else{
          this.toastrService.warning('Category title is same as earlier title')
          this.renderer.setProperty(this.dynamicItemFromQueryList.nativeElement, 'innerHTML', this.todoListTitleName.trim().replace(/&nbsp;/g, ''));
        }
      } else {
      this.renderer.setProperty(this.dynamicItemFromQueryList.nativeElement, 'innerHTML', this.todoListTitleName.trim().replace(/&nbsp;/g, ''));
      this.renderer.removeAttribute(this.dynamicItemFromQueryList.nativeElement, 'contenteditable' );
      this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'border')
      this.renderer.removeStyle(this.dynamicItemFromQueryList.nativeElement, 'cursor')
      }
    }
  }
}
