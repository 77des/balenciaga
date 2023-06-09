import {makeAutoObservable} from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios';
import { API_URL } from '../http'
import { toast } from 'react-hot-toast'

export default class UserStore {
	user = {};
	isAuth = false;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAuth(bool) {
		this.isAuth = bool;
	}

	setUser(user) {
		this.user = user;
	}

	setLoading(bool) {
		this.isLoading = bool;
	}

	async login(email, password) {
		try {
			const response = await AuthService.login(email, password);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e) {
			toast.error(e.response.data.message);
		}
	}

	async registration(formData) {
		try {
			const response = await AuthService.registration(formData);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e) {
			toast.error(e.response.data.message);
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout();
			localStorage.removeItem('token');
			this.setAuth(false);
			this.setUser({});
		} catch (e) {
			toast.error(e.response.data.message);
		}
	}

	async checkAuth() {
		this.setLoading(true)
		try {
			const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true});
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			this.setLoading(false);
		}
	}
}