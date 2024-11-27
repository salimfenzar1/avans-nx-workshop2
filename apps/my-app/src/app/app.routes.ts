import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { UserDetailsComponent, UserEditComponent, UserListComponent, ColumnsComponent } from '@avans-nx-workshop/features';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecipesComponent } from './components/recipe/recipe.component';
import { RecipeAddComponent } from './components/recipe-add/recipe-add.component';
import { RecipeDetailComponent } from './components/recipe/recipe_detail.component';
import { RecipeEditComponent } from './components/recipe/recipe_edit.component';
import { AuthGuard } from '@avans-nx-workshop/features';

export const appRoutes: Route[] = [
    // Hier komen onze URLs te staan.
    { path: '', pathMatch: 'full', redirectTo: 'dashboard'}, 
    { path: 'dashboard', component: DashboardComponent },
    { path: 'about', pathMatch: 'full', component: AboutComponent },
    { path: 'users', pathMatch: 'full', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
    { path: 'users/new', component: UserEditComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/edit', component: UserEditComponent, canActivate: [AuthGuard] },
    {path: 'columns',component: ColumnsComponent, children:[
        {path: ':id', component: UserDetailsComponent, canActivate: [AuthGuard]}
    ] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard] },
    { path: 'recipes/add', component: RecipeAddComponent, canActivate: [AuthGuard] },
    { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] }, 
    { path: 'recipes/edit/:id', component: RecipeEditComponent, canActivate: [AuthGuard] }, 




    { path: '**', redirectTo: 'dashboard'}
];
