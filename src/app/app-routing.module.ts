import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component'

const routes: Routes = [
  { path: '', redirectTo: 'popup', pathMatch: 'full' },

  {
    path: 'popup',
    loadChildren: () => import(`./popup/popup.module`).then((m) => m.PopupModule),
  },

  // Wildcard route for a 404 page
  { path: '**', component: PageNotFoundComponentComponent },
]

@NgModule({
  // Use hash to make the URL work. Chrome extensions does not support default
  // resource on url patch, meaning than when directly navigating to a page the
  // chrome does not know what to load. This fixes that
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
