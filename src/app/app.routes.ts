import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserModule } from './user/user.module';
import { MyAuctionsComponent } from './artist/my-auctions/my-auctions.component';
import { AddArtworkComponent } from './artist/add-artwork/add-artwork.component';
import { ViewArtworkComponent } from './artist/view-artwork/view-artwork.component';
import { EditArtworkComponent } from './artist/edit-artwork/edit-artwork.component';
import { PanierComponent } from './pages/panier/panier.component';
import { AddEvenementComponent } from './artist/add-evenement/add-evenement.component';
import { EditEvenementComponent } from './artist/edit-evenement/edit-evenement.component';
import { ListEvenementComponent } from './artist/list-evenement/list-evenement.component';
import { EventsComponent } from './pages/events/events.component';
import { ArtworksComponent } from './pages/artworks/artworks.component';
import { ConditionsDUtilisationComponent } from './rules/conditions-d-utilisation/conditions-d-utilisation.component';
import { MentionsLegalesComponent } from './rules/mentions-legales/mentions-legales.component';
import { OeuvresEnAttenteComponent } from './admin/oeuvres-en-attente/oeuvres-en-attente.component';
import { EvenementsEnAttenteComponent } from './admin/evenements-en-attente/evenements-en-attente.component';
import { CheckoutComponent } from './pages/checkout/checkout.component'; // Importer le composant Checkout
import { PaymentOnlineComponent } from './pages/payment-online/payment-online.component'; // Importer le composant PaymentOnline
import { PaymentCashComponent } from './pages/payment-cash/payment-cash.component'; // Importer le composant PaymentCash
import { OrderHistoryComponent } from './order-history/order-history.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirection par défaut vers home
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'add', component: AddArtworkComponent },
  { path: 'mes-oeuvres', component: ViewArtworkComponent },
  { path: 'my-auctions', component: MyAuctionsComponent },
  { path: 'edit-artwork/:id', component: EditArtworkComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'checkout', component: CheckoutComponent }, // Nouvelle route pour la confirmation de commande
  { path: 'payment-online', component: PaymentOnlineComponent }, // Nouvelle route pour le paiement en ligne
  { path: 'payment-cash', component: PaymentCashComponent }, // Nouvelle route pour le paiement cash
  { path: 'update-evenement/:id', component: EditEvenementComponent },
  { path: 'artiste/mes-evenements', component: ListEvenementComponent },
  { path: 'artiste/add-evenement', component: AddEvenementComponent },
  { path: 'events', component: EventsComponent },
  { path: 'artworks', component: ArtworksComponent },
  { path: 'mentions', component: MentionsLegalesComponent },
  { path: 'conditions', component: ConditionsDUtilisationComponent }, // Ajouté pour cohérence, si utilisé
  { path: 'admin/oeuvres-en-attente', component: OeuvresEnAttenteComponent },
  { path: 'admin/evenements-en-attente', component: EvenementsEnAttenteComponent },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  { path: 'order-history', component: OrderHistoryComponent },
];