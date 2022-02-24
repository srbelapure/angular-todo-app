import { Component, ElementRef, OnInit , Renderer2} from '@angular/core';
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
  randomNumberForColor:number=0
  dynamicItemFromQueryList:ElementRef
  editCategoryTitleMode:boolean=false
  queryListItems:Array<ElementRef>=[]
  getLatestSelectedElementFromArray:any
  isEnterKeyPressed:boolean=false
  anyKeyPressed:boolean=false

  // @ViewChild('test', { static: false }) testchild: ElementRef;
  // @ViewChildren('test') private test: QueryList<ElementRef>;


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

  editTodoListTitle(e:any, title: string, id: string) {
    e.stopPropagation() //to allow editing of title and prevent page routing

    this.idForUpdatingTodoTitle = id
    this.setChangesWithRenderer(e.path[3].children[1].children[0])
  }

  deleteTodoList(e:Event,id:string,listTitle:string){
    e.stopPropagation() //to allow deleting of title and prevent page routing
    this.todolistCatService.deleteTodoListCategory(id,listTitle)
  }

  onSelectTodoList(id: string, categoryTitle: string) {
    /**We can use state for NavigationExtras to transfer data from one page to another, or use a service, but this data is lost after refresh. So I have used a local storage */
    // let navigationExtras:NavigationExtras={
    //   state:{
    //     categorytitle : categoryTitle
    // }}
    // this.CategorydataService.categoryTitle = categoryTitle

    localStorage.setItem("categoryTitle", categoryTitle)
    this.router.navigate(['/todo', id])
  }

  setChangesWithRenderer(e:any){
    this.renderer.setAttribute(e, 'tabindex', '0');
    this.renderer.setAttribute(e, 'contenteditable', 'true');
    e.focus()
    // this.renderer.setAttribute(e, 'autofocus', 'true');
    this.renderer.setStyle(e, 'cursor', 'text');
    this.renderer.setStyle(e, 'outline', 'none');
    this.renderer.setStyle(e, 'border-bottom', '1px solid #919143');
    this.renderer.setStyle(e, 'padding', '5px 0px');
    this.renderer.setStyle(e, 'margin', '20px 0px');
    
    this.todoListTitleName = e.innerHTML;

    window.addEventListener("keydown",(e:any)=>{
      this.anyKeyPressed = true
      if(e.keyCode === 32){
        //use this if loop and alter the if-else cases to prevent a success toaster on adding only spaces to an existing name
        this.anyKeyPressed = false
      }
    })
  }

  createText(e:any, title: string, id: string, color: string) {
    e.stopPropagation() //to allow editing of title and prevent page routing
    this.idForUpdatingTodoTitle = id

    // this.setChangesWithRenderer(e.path[0])
    this.setChangesWithRenderer(e.currentTarget) //changed this to currentTarget,because we may have image or any html tag as a entry in a string

    this.editCategoryTitleMode = true

    // let elements = this.test.toArray()
    // elements.forEach(item => {
    //   if ('test' + id === item.nativeElement.id) {
    //     this.dynamicItemFromQueryList = item

    //    this.todoListTitleName = item.nativeElement.innerHTML.trim().replace(/&nbsp;/g, '');

    //     this.renderer.setAttribute(this.dynamicItemFromQueryList.nativeElement, 'contenteditable', 'true');
    //     this.renderer.setAttribute(this.dynamicItemFromQueryList.nativeElement, 'autofocus', 'true');
    //     this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'cursor', 'text');
    //     this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'background-color', color);
    //     this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'outline', 'none');
    //     this.renderer.setStyle(this.dynamicItemFromQueryList.nativeElement, 'border', '1px solid');

    //     this.editCategoryTitleMode = true
    //   }
    //   else {
    //     this.renderer.removeAttribute(item.nativeElement, 'contenteditable' );
    //     this.renderer.removeStyle(item.nativeElement, 'border')
    //   }
    // });
  }

  onEnterPress(e: any) {
    this.isEnterKeyPressed=true

    let istitleChanged = this.todoListTitleName !== e.target.innerHTML ? true : false

    this.todoListTitleName = e.target.innerHTML;

    // this.renderer.removeAttribute(e.currentTarget, 'contenteditable' );
    // this.renderer.removeStyle(e.currentTarget, 'border')
    // this.renderer.removeStyle(e.currentTarget, 'cursor')

    this.removeTheRendererProperties(e)

    this.editCategoryTitleMode = false

    window.removeEventListener("blur",(e)=>{
      this.onSelectingNewTitle(e)
    })

    if (istitleChanged) {
      this.todolistCatService.updateTodoListTitleName(this.todoListTitleName, this.idForUpdatingTodoTitle)
      this.isEnterKeyPressed=false
    }
    else{
      this.toastrService.warning('Category title is same as earlier title')
      this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoListTitleName);
      this.isEnterKeyPressed=false
    }

  }


  onSelectingNewTitle(e: any) {
    let istitleChanged = this.todoListTitleName !== e.target.innerHTML ? true : false
    if(!this.isEnterKeyPressed){
      this.isEnterKeyPressed = false
      let confirmBox = confirm('your current title changes are not saved.\nPress OK to save the changes or Cancel to exit the changes')
      if (confirmBox) {
        this.editCategoryTitleMode = false
        this.todoListTitleName = e.target.innerHTML;

        this.removeTheRendererProperties(e)

        // this.renderer.removeAttribute(e.currentTarget, 'contenteditable' );
        // this.renderer.removeStyle(e.currentTarget, 'border')
        // this.renderer.removeStyle(e.currentTarget, 'cursor')

        if (istitleChanged) {
          this.todolistCatService.updateTodoListTitleName(this.todoListTitleName, this.idForUpdatingTodoTitle)
        }
        else{
          this.toastrService.warning('Category title is same as earlier title')
          this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoListTitleName);
        }
      } else {
      this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoListTitleName);

      this.removeTheRendererProperties(e)

      // this.renderer.removeAttribute(e.currentTarget, 'contenteditable' );
      // this.renderer.removeStyle(e.currentTarget, 'border')
      // this.renderer.removeStyle(e.currentTarget, 'cursor')
      }
    }
  }

  removeTheRendererProperties(e:any){
    this.renderer.removeAttribute(e.target, 'tabindex');
    this.renderer.removeAttribute(e.target, 'contenteditable');
    e.target.blur()
    // this.renderer.setAttribute(e, 'autofocus', 'true');
    this.renderer.removeStyle(e.target, 'cursor');
    this.renderer.removeStyle(e.target, 'outline');
    this.renderer.removeStyle(e.target, 'border-bottom');
    this.renderer.removeStyle(e.target, 'padding');
    this.renderer.removeStyle(e.target, 'margin');
  }
}
