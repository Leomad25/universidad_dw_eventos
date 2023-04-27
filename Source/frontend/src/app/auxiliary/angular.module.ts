import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MessageAlertComponent } from "../component/message-alert/message-alert.component";
import { LoadingComponent } from '../component/loading/loading.component';

export const AngularModuls = [
    ReactiveFormsModule,
    HttpClientModule
]

export const Components = [
    MessageAlertComponent,
    LoadingComponent
]