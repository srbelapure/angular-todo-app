import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TodolistcategoryService {

  constructor(private angularfirestore: AngularFirestore,
    private toastrService: ToastrService) { }

  saveTodoListTitle(data: any) {
    this.angularfirestore.collection('categories').add(data).then(ref => {
      this.toastrService.success('New TO-DO list Title Added Successfully')
    })
  }

  getTodoListsCategories() {
    //get all the to-do lists from firestore
    return this.angularfirestore.collection('categories').snapshotChanges().pipe(
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

  updateTodoListTitleName(updatedTitle: string, id: string) {
    this.angularfirestore.doc('categories/' + id).update({
      category: updatedTitle
    }).then(() => {
      this.toastrService.success('Updated the List Title')
    })
  }

  deleteTodoListCategory(id: string, listTitle: string) {
    /**We can use either of methods to delete document from collection */

    // this.angularfirestore.collection('categories').doc(id).delete().then(() => {
    //   this.toastrService.error('ToDO list' + ' ' + listTitle + ' ' + 'deleted successfully')
    // })

    this.angularfirestore.doc('categories/' + id).delete().then(() => {
      this.toastrService.error('ToDO list' + ' ' + listTitle + ' ' + 'deleted successfully')
    })
  }
}
