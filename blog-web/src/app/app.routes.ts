import { Routes } from '@angular/router';
import { BlogListComponent } from './features/blog-list/blog-list.component';
import { BlogViewComponent } from './features/blog-view/blog-view.component';
import { BlogAddComponent } from './features/blog-add/blog-add.component';

export const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'add', component: BlogAddComponent },
  { path: 'entry/:id', component: BlogViewComponent },
  { path: '**', redirectTo: '' }
];
