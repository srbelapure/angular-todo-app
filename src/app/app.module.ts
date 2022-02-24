import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { TodoCategoriesComponent } from './todo-categories/todo-categories.component';
import { TodoComponent } from './todo/todo.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RemovespacesPipe } from './removespaces.pipe';
import { BypassHTMLsanitizationPipe } from './bypass-htmlsanitization.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TodoCategoriesComponent,
    TodoComponent,
    PagenotfoundComponent,
    RemovespacesPipe,
    BypassHTMLsanitizationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule, // ngx toastr requires this module
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
