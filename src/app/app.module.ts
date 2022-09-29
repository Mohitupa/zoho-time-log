
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './mycomponents/todos/todos.component';
import { FormsModule } from '@angular/forms';

import { MycomponentsComponent } from './mycomponents/mycomponents.component';
import { TodosHeaderComponent } from './mycomponents/todos-header/todos-header.component';
import { TodoItemComponent } from './mycomponents/todo-item/todo-item.component';
import { AddTodoComponent } from './mycomponents/add-todo/add-todo.component';
import { TodoFooterComponent } from './mycomponents/todo-footer/todo-footer.component';
import { SoundComponent } from './music/sound/sound.component';
import { Sound02Component } from './music/sound02/sound02.component';
import { TimelogComponent } from './zoho/timelog/timelog.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ShowTimeLogDataComponent } from './zoho/show-time-log-data/show-time-log-data.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    MycomponentsComponent,
    TodosHeaderComponent,
    TodoItemComponent,
    AddTodoComponent,
    TodoFooterComponent,
    SoundComponent,
    Sound02Component,
    TimelogComponent,
    ShowTimeLogDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
