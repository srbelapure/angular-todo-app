import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { TodoCategoriesComponent } from './todo-categories/todo-categories.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {path:'',component:TodoCategoriesComponent},
  {path:'todo/:id',component:TodoComponent},
  { path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
