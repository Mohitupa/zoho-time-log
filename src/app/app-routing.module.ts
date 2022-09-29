import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoundComponent } from './music/sound/sound.component';
import { Sound02Component } from './music/sound02/sound02.component';
import { MycomponentsComponent } from './mycomponents/mycomponents.component';
import { TimelogComponent } from './zoho/timelog/timelog.component';

const routes: Routes = [
  {path: '',component:TimelogComponent},
  {path: 'sound',component:Sound02Component},
  {path:'todos',component: MycomponentsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
