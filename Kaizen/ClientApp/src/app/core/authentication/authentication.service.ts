import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { CookieService } from 'ngx-cookie-service';

import { Endpoints } from '@global/endpoints';
import { LoginRequest } from '@core/models/login-request';
import { User } from '@core/models/user';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	readonly USER_LOCALSTORAGE_KEY = 'currentUser';

	constructor(private http: HttpClient, private cookieService: CookieService) {}

	registerUser(user: User): Observable<User> {
		return this.http.post<User>(Endpoints.AuthUrl, user);
	}

	loginUser(user: LoginRequest): Observable<User> {
		return this.http.post<User>(`${Endpoints.AuthUrl}/Login`, user);
	}

	logoutUser(): void {
		this.removeUser();
	}

	removeUser(): void {
		localStorage.removeItem(this.USER_LOCALSTORAGE_KEY);
		this.cookieService.delete('user_token');
	}

	setCurrentUser(user: User): void {
		this.cookieService.set('user_token', user.token, 365, '/', null, true);
		user.token = undefined;
		let user_str = JSON.stringify(user);
		localStorage.setItem(this.USER_LOCALSTORAGE_KEY, user_str);
	}

	getToken(): string {
		return this.cookieService.get('user_token');
	}

	getCurrentUser(): User {
		let user_str = localStorage.getItem(this.USER_LOCALSTORAGE_KEY);
		if (isNullOrUndefined(user_str)) {
			return null;
		} else {
			const user: User = JSON.parse(user_str);
			return user;
		}
	}

	userLoggedIn(): boolean {
		return this.getCurrentUser() != null;
	}
}
