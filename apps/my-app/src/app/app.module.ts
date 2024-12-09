import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { FeaturesModule } from '@avans-nx-workshop/features';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent} from './components/register/register.component'
import { AuthGuard } from '@avans-nx-workshop/backend/auth';
import { RecipesComponent } from './components/recipe/recipe.component';
import { RecipeAddComponent } from './components/recipe-add/recipe-add.component';
import { RecipeDetailComponent } from './components/recipe/recipe_detail.component';
import { RecipeEditComponent } from './components/recipe/recipe_edit.component';
import { FavoritesComponent } from './components/favorite_recipe/favorite_recipe.component';
import { KookclubComponent } from './components/kookclub/kookclub.component';
import { CreateKookclubComponent } from './components/kookclub/create-kookclub.component';
import { KookclubDetailComponent } from './components/kookclub/kookclub-detail.component';


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        AboutComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        RegisterComponent,
        RecipesComponent,
        RecipeAddComponent,
        RecipeDetailComponent,
        RecipeEditComponent,
        FavoritesComponent,
        KookclubComponent,
        CreateKookclubComponent,
        KookclubDetailComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking'
        }),
        FeaturesModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
