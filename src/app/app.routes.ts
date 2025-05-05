import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserModule } from './user/user.module';
import { MyAuctionsComponent } from './artist/my-auctions/my-auctions.component';
import { AddArtworkComponent } from './artist/add-artwork/add-artwork.component';
import { ViewArtworkComponent } from './artist/view-artwork/view-artwork.component';
import { EditArtworkComponent } from './artist/edit-artwork/edit-artwork.component';
export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'user/register',component:RegisterComponent},
    {path:'home',component:HomeComponent},
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{path:'add',component:AddArtworkComponent},
{path:'mes-oeuvres', component:ViewArtworkComponent},
{path:'my-auctions',component:MyAuctionsComponent},
{path:'edit-artwork/:id',component:EditArtworkComponent},
{
    path:'user',loadChildren:()=>import('./user/user.module').then((m)=>m.UserModule)
}
];
