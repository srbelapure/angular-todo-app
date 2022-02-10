import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoCategoriesComponent } from './todo-categories/todo-categories.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {path:'',component:TodoCategoriesComponent},
  {path:'todo/:id',component:TodoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
