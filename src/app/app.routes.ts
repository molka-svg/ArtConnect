import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserModule } from './user/user.module';
UserModule
export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'user/register',component:RegisterComponent},
    {path:'home',component:HomeComponent},
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{
    path:'user',loadChildren:()=>import('./user/user.module').then((m)=>m.UserModule)
}
];
