import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CONSTANTS } from '../../app.constants';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { HttpService } from '../interceptor/http.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
    private user: any = {};
    private viewMenu: boolean;
    private userType: number = 1;
    private hasProgressed: boolean = true;
    private myNotification: any = [{ "id": "1", "message": "First Notification" }, { "id": "2", "message": "Second Notification" }, { "id": "3", "message": "Third Notification" }, { "id": "4", "message": " Forth Notification" }];
    private forgetEmailId : any;
    constructor(
        private http: HttpService,
        private cookies: CookieService,
        private config: ConfigService
    ) {
        this.viewMenu = false;
    }

    setHasProgressed() {
        this.hasProgressed = true;
    }

    getHasProgressed() {
        return this.hasProgressed;
    }

    resetHasProgressed() {
        this.hasProgressed = false;
    }

    login(lnData: any) {
        let username: string = lnData.Email_Address;
        let password: string = lnData.User_Password;
        let access_token: string = this.config.getAccessToken();
        let headers = new Headers();

        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        return this.http.post(this.config.getBasePath() + '/auth', { access_token: access_token, User_Role: this.getUserType() }, { headers: headers })
            .map((response: Response) => {
                if (response.json() && response.json().token) {
                    // create a cookies for newuser 
                    this.cookies.put('user', JSON.stringify(response.json()));
                    this.setNotification(this.myNotification);
                }
                //return response.json();
            })
            .catch((error) => Observable.throw(error.json()));
    }

    forget(username): Observable<boolean> {
        this.user.email = username;
        return this.http.put(this.config.getBasePath() + 'api/users/forgotpassword', this.user)
            .map((response: Response) => { return true; })
            .catch((error: any) => Observable.throw(error.json().message || 'Server error'));
    }

    create(_id, password): Observable<boolean> {
        this.user.password = password;
        return this.http.put(this.config.getBasePath() + 'api/users/' + _id + '/setpassword', this.user)
            .map((response: Response) => {
                return true;
            })
            .catch((error: any) => Observable.throw(error.json().message || 'Server error'));
    }


    acceptEula(id, EULA_Accepted, AcceptedVersion): Observable<boolean> {

        let eulareqbody: any = {};
        eulareqbody.eulaVersion = AcceptedVersion;

        //attaching the termsAcceptance status to requestbody
        eulareqbody.EULA_Accepted = EULA_Accepted;

        return this.http.put(this.config.getBasePath() + 'api/users/' + id + '/accepteula', eulareqbody)
            .map((response: Response) => {
                if (response.json() && response.json().token) {
                    // set user                 
                    this.cookies.put('user', JSON.stringify(response.json()));
                    this.setNotification(this.myNotification);
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch((error: any) => Observable.throw(error.json().message || 'Server error'));
    }


    change(_id, oldPassword, newPassword): Observable<boolean> {
        // change(user): Observable<boolean> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });

        this.user._id = _id;
        this.user.oldPassword = oldPassword;
        this.user.newPassword = newPassword;
        return this.http.put(this.config.getBasePath() + 'api/users/' + _id + '/password', this.user, options)
            // delete user.confpassword;

            .map((response: Response) => { return true; })
            .catch((error: any) => {
                console.log(error);
                if (error.status == 403) error = 'Password not correct';
                return Observable.throw(error);
            });
    }

    reset(_id, oldPassword, newPassword): Observable<boolean> {
        this.user._id = _id;
        this.user.oldPassword = oldPassword;
        this.user.newPassword = newPassword;
        return this.http.put(this.config.getBasePath() + 'api/users/' + _id + '/resetpassword', this.user)
            .map((response: Response) => {
                if (response.json() && response.json().token) {
                    let userstr = JSON.stringify(response.json())
                    // save user 
                    this.cookies.put('user', userstr);
                    this.setNotification(this.myNotification);
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch((error: any) => Observable.throw(error.json().message || 'Server error'));
    }

    logout(): void {
        this.cookies.remove('progress');
        this.cookies.remove('user');
    }

    isLoggedIn(): boolean {
        if (this.getToken()) return true;
        else return false;
    }

    canActivate(): any {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });

        if (this.isLoggedIn())
            return this.http.get(this.config.getBasePath() + '/users/isLoggedIn', options)
                .map((response) => response,
                (error) => Observable.throw(error));

        return Observable.throw(false);
    }

    getToken(): string {
        if (this.cookies.getObject('user')) return this.cookies.getObject('user')['token'];
        return null;
    }

    getUserId(): string {

        if (this.cookies.getObject('user')) return this.cookies.getObject('user')['user']['User_ID'];
        return '';
    }

    getUserRole(): string {
        if (this.cookies.getObject('user')) return this.cookies.getObject('user')['user']['User_Role'];
        return '';
    }

    getRoute(reqPath): string {
        reqPath = '/' + reqPath;
        if (this.cookies.getObject('user') && this.cookies.getObject('user')['user']) {
            var role = this.cookies.getObject('user')['user']['User_Role'];
            role == CONSTANTS.userRole.renter ? reqPath = '/user' + reqPath : role == CONSTANTS.userRole.broker ? reqPath = '/broker' + reqPath : reqPath = '/landlord' + reqPath;
        }
        //console.log(reqPath);
        return reqPath
    }

    getEmail(): string {
        return this.user.email;
    }

    getName(): string {
        var curUser = this.cookies.getObject('user')['user'];
        if (curUser) return curUser['User_Last_Name'] + ', ' + curUser['User_First_Name'];
        return '';
    }
    getFirstName(): string {
        var curUser = this.cookies.getObject('user')['user'];
        if (curUser) return curUser['User_First_Name'];
        return '';
    }

    getMenu(): boolean {
        return this.viewMenu;
    }

    showMenu(event) {
        this.viewMenu = !this.viewMenu;
        event.stopPropagation();
    }

    hideMenu() {
        this.viewMenu = false;
    }

    getEulaVersion(): string {
        if (this.cookies.getObject('user')) return this.cookies.getObject('user')['eulaVersion'];
        return '';
    }

    setUserType(type) {
        this.userType = type;
        sessionStorage.setItem("loginUserType", type);
    }

    isRenterPanel() {
        return (this.userType == CONSTANTS.userRole.renter);
    }

    isBrokerPanel() {
        return (this.userType == CONSTANTS.userRole.broker);
    }

    isLandlordPanel() {
        return (this.userType == CONSTANTS.userRole.landlord);
    }

    getUserType() {
        //return this.userType;
        return sessionStorage.getItem("loginUserType");
    }

    isRenter() {
        // return !(this.isLoggedIn() && Number(this.getUserRole()) > CONSTANTS.userRole.renter);
        // console.log("this.getUserRole(): ");
        // console.log("this.getUserRole(): ", Number(this.getUserRole()));
        // console.log("CONSTANTS.userRole.renter: ", CONSTANTS.userRole.renter);
        return Number(this.getUserRole()) == CONSTANTS.userRole.renter;
    }

    forgetPassword(username): Observable<boolean> {
        this.user.email = username;
        return this.http.put(this.config.getBasePath() + 'api/users/forgotpassword', this.user)
            .map((response: Response) => { return true; })
            .catch((error: any) => Observable.throw(error.json().message || 'Server error'));
    }

    setNotification(myNotification) {
        this.myNotification = myNotification;
    }

    getNotification() {
        return this.myNotification;
    }

    setEmailIdForForgetPwd(forgetEmailId){
        console.log("forgetEmailId", forgetEmailId);
        this.forgetEmailId = forgetEmailId;
        console.log("forgetEmailId 1", forgetEmailId);
    }

    getEmailIdForForgetPwd(){
        return this.forgetEmailId;
    }
}