import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TodolistService } from '../service/todolist.service';
import { NgForm } from '@angular/forms';
import 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';

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
  idForUpdatingTodoItem: string = '';
  isTodoItemChecked:boolean=false
  anyKeyPressed:boolean=false
  isEnterKeyPressed:boolean=false
  categoryTitle:string


  constructor(private route: ActivatedRoute,
    private router:Router,
    private todolistService: TodolistService,
    private renderer:Renderer2,
    private toastrService: ToastrService) {
      // this.categoryTitle = this.router.getCurrentNavigation()?.extras.state.categorytitle

      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation ? navigation.extras.state as {categorytitle: string} : "No data"
      // this.categoryTitle = state.categorytitle;
     }

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
      this.categoryTodoItemsList = listItems
    })


    // this.categoryTitle = history.state.categorytitle;
    // this.categoryTitle = this.CategorydataService.categoryTitle
    // this.CategorydataService.categoryTitle=''

    this.categoryTitle= localStorage.getItem("categoryTitle") || '{}'
  }

  onAddItemToList(formData: NgForm) {
      let todoItemData = {
        todo: formData.value.todoItemText,
        iscompleted: false,
        timestamp: new Date()
      }
      let newlycreatedcategory = false //this is to set that the category has/had an item in it so it is no more newly created
      this.todolistService.saveTodoList(this.todoListCategoryId, todoItemData,newlycreatedcategory)

      formData.reset()
  }

  onEditTodoItem(e:any,itemValue: string, id: string) {
    this.todoitemvalue = itemValue
    this.idForUpdatingTodoItem = id
    this.setChangesWithRenderer(e.path[4].children[0].children[1])
  }

  onDeleteTodoItem(id: string,isItemCompleted:boolean) {
    this.todolistService.deleteTodoItem(this.todoListCategoryId, id,isItemCompleted)
  }

  onCompleteAction(isItemCompleted: boolean, id: string) {
    this.isTodoItemChecked = !isItemCompleted
    this.todolistService.markItemComplete(this.todoListCategoryId, id, this.isTodoItemChecked)
  }

  onIncompleteAction(isItemCompleted: boolean, id:string) {
    this.isTodoItemChecked = !isItemCompleted
    this.todolistService.markItemIncomplete(this.todoListCategoryId, id, this.isTodoItemChecked)
  }

  // ontodoItemChange(e: any) {
  //   console.log('##############', e.target.checked, e.target.value, e.target.name)

  //   this.isTodoItemChecked = e.target.checked
  // }

  setChangesWithRenderer(e:any){
    this.renderer.setAttribute(e, 'tabindex', '0');
    this.renderer.setAttribute(e, 'contenteditable', 'true');
    e.focus()
    // this.renderer.setAttribute(e, 'autofocus', 'true');
    this.renderer.setStyle(e, 'cursor', 'text');
    this.renderer.setStyle(e, 'outline', 'none');
    this.renderer.setStyle(e, 'border-bottom', '1px solid #919143');
    this.renderer.setStyle(e, 'padding', '5px');
    
    this.todoitemvalue = e.innerHTML.trim().replace(/&nbsp;/g, '');
    
    window.addEventListener("keydown",(e:any)=>{
      this.anyKeyPressed = true
      if(e.keyCode === 32){
        //use this if loop and alter the if-else cases to prevent a success toaster on adding only spaces to an existing name
        this.anyKeyPressed = false
      }
    })
  }

  createText(e:any,id: string) {
    this.idForUpdatingTodoItem = id

    this.setChangesWithRenderer(e.path[0])

  }

  onEnterPress(e: any) {
    this.isEnterKeyPressed=true

    let istitleChanged = this.todoitemvalue.trim().replace(/&nbsp;/g, '') !== e.target.innerHTML.trim().replace(/&nbsp;/g, '') ? true : false

    this.todoitemvalue = e.target.innerHTML.trim().replace(/&nbsp;/g, '');

    // this.renderer.removeAttribute(e.currentTarget, 'contenteditable' );
    // this.renderer.removeStyle(e.currentTarget, 'border')
    // this.renderer.removeStyle(e.currentTarget, 'cursor')

    this.removeTheRendererProperties(e)

    window.removeEventListener("blur",(e)=>{
      this.onSelectingNewTitle(e)
    })

    if (istitleChanged && this.anyKeyPressed) {
      this.todolistService.updateTodoItem(this.todoListCategoryId, this.idForUpdatingTodoItem, this.todoitemvalue)
      this.isEnterKeyPressed=false
    }
    else{
      this.toastrService.warning('Category title is same as earlier title')
      this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoitemvalue.trim().replace(/&nbsp;/g, ''));
      this.isEnterKeyPressed=false
    }

  }

  onSelectingNewTitle(e: any){
    let istitleChanged = this.todoitemvalue.trim().replace(/&nbsp;/g, '') !== e.target.innerHTML.trim().replace(/&nbsp;/g, '') ? true : false
    if(!this.isEnterKeyPressed){
      this.isEnterKeyPressed = false
      let confirmBox = confirm('your current title changes are not saved.\nPress OK to save the changes or Cancel to exit the changes')
      if (confirmBox) {
        this.todoitemvalue = e.target.innerHTML.trim().replace(/&nbsp;/g, '');

        this.removeTheRendererProperties(e)

        // this.renderer.removeAttribute(e.currentTarget, 'contenteditable' );
        // this.renderer.removeStyle(e.currentTarget, 'border')
        // this.renderer.removeStyle(e.currentTarget, 'cursor')
        if (istitleChanged && this.anyKeyPressed) {
          this.todolistService.updateTodoItem(this.todoListCategoryId, this.idForUpdatingTodoItem, this.todoitemvalue)
        }
        else{
          this.toastrService.warning('Category title is same as earlier title')
          this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoitemvalue.trim().replace(/&nbsp;/g, ''));
        }
      } else {
      this.renderer.setProperty(e.currentTarget, 'innerHTML', this.todoitemvalue.trim().replace(/&nbsp;/g, ''));
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

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe()
  }

}
