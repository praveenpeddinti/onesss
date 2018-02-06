import { Component, OnInit } from '@angular/core';
import {  Collaborator } from '../../services/login.service';
import { Router,ActivatedRoute } from '@angular/router';
import { GlobalVariable } from '../../config';
import { AjaxService } from '../../ajax/ajax.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

// public _ref:any;
public inviteCode;        //for activationcode
public collaboraterEmial; //for activation Email
public errorEmailVlaidCheckMsg ='';

public ShowForm=true;
public isEmailValid=false;
public forgotEmail = '';
public errorMsg = '';
public submitted = false;
public checkData=false;
public isSuccess:boolean=false;

constructor( 
	private _router: Router,
	private route: ActivatedRoute,
	private _ajaxService: AjaxService
	) { }

ngOnInit() {
	var getAllObj=JSON.parse(localStorage.getItem("user"));
	if(getAllObj != null && getAllObj != "failure"){
		this._router.navigate(['user-dashboard']); 
	}else{
		var thisObj=this;
		thisObj.route.queryParams.subscribe(
			params => 
			{
				thisObj.inviteCode=params['code'];
				thisObj.collaboraterEmial=params['email'];
				if(thisObj.collaboraterEmial && thisObj.inviteCode){
					this.ShowForm = false;
					thisObj.verifyForgotPasswordInvitation(thisObj.inviteCode,thisObj.collaboraterEmial);
				}
			})
	}
}


public collaboratorForgotObj = {
	'username': '',
}
forgotpwd(){
	this.unsetValidation();
	this.collaboratorForgotObj.username=this.forgotEmail;
	this._ajaxService.AjaxSubscribe("site/forgot-password",this.collaboratorForgotObj,(result)=>
	{ 
		// console.log('ajax triggered');
		var userdata ='';
		if(result.status==200){
			if(result.data == 'failure'){
				// console.log('failure');
				this.isSuccess=false;
				userdata = '';
				this.checkData=true;
				this.errorMsg = 'The email you have entered does not exists.';
			}else{
				// console.log('sucess');
				this.isSuccess=true;
				userdata = result.data;
				this.submitted =false;
				this.checkData =false;
			this.forgotEmail ='';  //reset form
			this.ShowForm= false; //To disable the form
		}
	}else{
		// console.log('ajax error');
		this.isSuccess=false;
		userdata = '';
		this.checkData=true;
		this.errorMsg = 'The email you have entered does not exists.';
	}
});
}

/*
* Added by Padmaja
* Validating Email in Email pattern
*/
validateEmail(email){
	var pattern=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	this.isEmailValid = pattern.test(email); 
}



/*To  clear the error mesasge */
unsetValidation(){
	this.checkData=false;
	this.errorEmailVlaidCheckMsg='';
}


/**
 * @description To verify code users details
 */
 verifyForgotPasswordInvitation(code,email){ 
 	this.unsetValidation();
 	var invite_obj={inviteCode:code,collaboraterEmial:email};
 	this._ajaxService.AjaxSubscribe("site/verify-forgot-password-invitation-code",invite_obj,(result)=>
 	{
 		if(JSON.parse(localStorage.getItem('userEmail'))){
 			localStorage.removeItem('userEmail');//if present remove
 		}
 		if(result.statusCode==200)	{
 			if(result.data == "failure")	{
 				this.errorEmailVlaidCheckMsg = 'Invalid password reset link. please try again';
 				this.ShowForm = false;
 			}
 			else {
 				// console.log(result.data); 			
 				var userEmail={'Email':result.data.Email,'Id':result.data.Id};
 				localStorage.setItem('userEmail',JSON.stringify(userEmail));
 				this._router.navigate(['new-password']);
 			}
 		}	else	{
 			this._router.navigate(['login']);
 		}

 	})
 }

/**
 * @description To show/hide form
 */

 showForm(){
 	this.errorEmailVlaidCheckMsg='';
 	this.ShowForm = !this.ShowForm;
 }


}
