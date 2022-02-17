import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
import { increment } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  constructor(private angularfirestore: AngularFirestore,
    private toastrService: ToastrService) { }

  getListOfTodoItems(id: string) {
    return this.angularfirestore.collection('categories').doc(id).collection('todolist', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().pipe(
      map(
        actions => {
          return actions.map(item => {
            let data = item.payload.doc.data();
            let id = item.payload.doc.id;
            return { data, id }
          })
        }
      )
    )
  }

  saveTodoList(id: string, data: any,newlycreatedcategory:boolean) {
    this.angularfirestore.collection('categories').doc(id).collection('todolist').add(data).then(ref => {
      this.angularfirestore.doc('categories/'+id).update({
        todocount: increment(1),
        newlycreatedcategory:newlycreatedcategory
      })
      this.toastrService.success('New TO-DO item Added Successfully')
    })
  }

  updateTodoItem(categoryId: string, itemId: string, todoItemValue: string) {
    this.angularfirestore.doc('categories/' + categoryId + '/todolist/' + itemId).update({
      todo: todoItemValue
    }).then(() => {
      this.toastrService.success('Updated the item')
    })
  }

  deleteTodoItem(categoryId: string, itemId: string, isItemCompleted:boolean) {
    this.angularfirestore.collection('categories').doc(categoryId).collection('todolist').doc(itemId).delete().then(() => {
      if(!isItemCompleted){
        this.angularfirestore.doc('categories/'+categoryId).update({
          todocount: increment(-1)
        })
      }
      this.toastrService.error('Todo item deleted successfully')
    })
  }

  markItemComplete(categoryId: string, itemId: string, iscompletedTodoItem: boolean){
    this.angularfirestore.doc('categories/' + categoryId + '/todolist/' + itemId).update({
      iscompleted: iscompletedTodoItem
    }).then(() => {
      this.angularfirestore.doc('categories/'+categoryId).update({
        todocount: increment(-1)
      })
      this.toastrService.info('Item has been completed')
    })
  }

  markItemIncomplete(categoryId: string, itemId: string, iscompletedTodoItem: boolean){
    this.angularfirestore.doc('categories/' + categoryId + '/todolist/' + itemId).update({
      iscompleted: iscompletedTodoItem
    }).then(() => {
      this.angularfirestore.doc('categories/'+categoryId).update({
        todocount: increment(1)
      })
      this.toastrService.info('Item is incomplete')
    })
  }

}
