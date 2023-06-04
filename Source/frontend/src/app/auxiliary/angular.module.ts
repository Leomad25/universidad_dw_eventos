import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MessageAlertComponent } from "../component/message-alert/message-alert.component";
import { LoadingComponent } from '../component/loading/loading.component';
import { EventCardComponent } from '../component/event-card/event-card.component';
import { EventCardEditComponent } from '../component/event-card-edit/event-card-edit.component';
import { EventListComponent } from '../component/event-list/event-list.component';

export const AngularModuls = [
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
]

export const Components = [
    MessageAlertComponent,
    LoadingComponent,
    EventCardComponent,
    EventCardEditComponent,
    EventListComponent
]