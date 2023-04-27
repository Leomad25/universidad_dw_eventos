import { AbstractControl } from "@angular/forms";


export class CustomValidators {
    static MatchPassword(AC: AbstractControl) {
        const formGroup = AC.parent;
        if (formGroup) {
            const passwordControl = formGroup.get('password');
            const confirmPasswordControl = formGroup.get('passwordConfirm');
        
            if (passwordControl && confirmPasswordControl) {
                const password = passwordControl.value;
                const confirmPassword = confirmPasswordControl.value;
                if (password !== confirmPassword) { 
                return { matchPassword: true };
                } else {
                return null;
                }
            }
        }
        return null;
    }
}