import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Login } from 'src/app/modals/login';
import { Register } from 'src/app/modals/register';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  registerForm!: FormGroup;
  loginMode: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private apiService: ApiService, private http: HttpClient,
    private _snackBar: MatSnackBar) {

    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{4,12}')]),
    });

     this.registerForm = this.fb.group({
      newEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{4,12}')]),
      role: new FormControl('admin')
    });

  }

  register() {
    try {
      if (this.registerForm.invalid) {
        this._snackBar.open('Please provide valid registration details', 'Ok', {
          duration: 1000
        });
        return;
      }

      const registerDTO: Register = {
        email: this.registerForm.value.newEmail,
        password: this.registerForm.value.newPassword,
        role: 'admin'
      };

      this.authService.register(registerDTO).then((res: any) => {
        if (res.status === "success") {
          this._snackBar.open('Registration successful', '', {
            duration: 1000
          });
          this.toggleLoginMode();
        } else {
          this._snackBar.open('Registration failed', '', {
            duration: 1000
          });
        }
      }, () => {
        this._snackBar.open('Something went wrong during registration', '', {
          duration: 1000
        });
      });

    } catch (err) {
      console.error("error", err);
      this._snackBar.open('Something went wrong during registration', '', {
        duration: 1000
      });
    }
  }

  login() {
    try {
      if (this.loginForm.invalid) {
        this._snackBar.open('Please provide valid email and password', 'Ok', {
          duration: 1000
        });
        return;
      }

      const loginDTO = new Login(this.loginForm.value.email, this.loginForm.value.password);

      this.authService.login(loginDTO).then((res: any) => {
        if (res.status === "failed") {
          this._snackBar.open('Invalid Email or Password', 'Ok', {
            duration: 1000
          });
          return;
        }

        let userData = res.records.result.docs;
        if (userData.length === 0) {
        } else {
          localStorage.removeItem("LOGGED_IN_USER");
          localStorage.removeItem("token");

          let user = userData[0];
          localStorage.setItem('token', res?.records?.token);
          localStorage.setItem("LOGGED_IN_USER", JSON.stringify(user));
          this.apiService.loginSubject.next(user);
          this.router.navigate(["/student-list"]);
          this._snackBar.open('Login success', '', {
            duration: 1000
          });
        }
      }, () => {
        this._snackBar.open('Something went wrong', '', {
          duration: 1000
        });
      });

    } catch (err) {
      this._snackBar.open('Something went wrong', '', {
        duration: 1000
      });
    }
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
    this.loginForm.reset();
    this.registerForm.reset();
  }


  setCrentials() {
    this.loginForm.patchValue({
      email: "test@gmail.com",
      password: "Test@123"
    });
  }
}
