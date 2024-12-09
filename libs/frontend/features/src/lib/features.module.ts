import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { ColumnsComponent } from './columns/columns.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './users/user.service';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './auth/auth.service';
import { RecipeService } from './recipes/recipe.service';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit_profile.component';
import { ReviewService } from './review/review.service';
import { KookclubService } from './kookClub/kookClub.service';
@NgModule({
    imports: [CommonModule, RouterModule,ReactiveFormsModule, HttpClientModule  ],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        ColumnsComponent,
        ProfileComponent,
        EditProfileComponent
        
    ],
    providers:[
        UserService,
        AuthService,
        RecipeService,
        AuthGuard,
        ReviewService,
        KookclubService
    ]
})
export class FeaturesModule {}



