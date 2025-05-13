import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserModule } from './user/user.module';
import { MyAuctionsComponent } from './artist/my-auctions/my-auctions.component';
import { AddArtworkComponent } from './artist/add-artwork/add-artwork.component';
import { ViewArtworkComponent } from './artist/view-artwork/view-artwork.component';
import { EditArtworkComponent } from './artist/edit-artwork/edit-artwork.component';
import { PanierComponent } from './pages/panier/panier.component'; // Importer PanierComponent
import { AddEvenementComponent } from './artist/add-evenement/add-evenement.component';
import { EditEvenementComponent } from './artist/edit-evenement/edit-evenement.component';
import { ListEvenementComponent } from './artist/list-evenement/list-evenement.component';
import { EventsComponent } from './pages/events/events.component';
import { ArtworksComponent } from './pages/artworks/artworks.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'add', component: AddArtworkComponent },
  { path: 'mes-oeuvres', component: ViewArtworkComponent },
  { path: 'my-auctions', component: MyAuctionsComponent },
  { path: 'edit-artwork/:id', component: EditArtworkComponent },
  { path: 'panier', component: PanierComponent }, 
  { path: 'update-evenement/:id', component: EditEvenementComponent }, 
  { path: 'artiste/mes-evenements', component: ListEvenementComponent}, 
  {path:'artiste/add-evenement',component:AddEvenementComponent},
  {path:'events',component:EventsComponent},
{path:'artworks',component:ArtworksComponent},
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
];