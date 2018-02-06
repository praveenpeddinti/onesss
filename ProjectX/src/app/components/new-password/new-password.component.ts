import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../ajax/ajax.service';
import {Router} from '@angular/router';

// declare var jQuery:any;
@Component({
	selector: 'app-new-password',
	templateUrl: './new-password.component.html',
	styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
	public form={};
	public isPasswordMatch:boolean=true;
	// public users=JSON.parse(localStorage.getItem('user'));
	public userEmail=JSON.parse(localStorage.getItem('userEmail'));
	public showHelper:boolean=false;
	public PasswordMsgClass='';
	public PasswordSuccessMsg='';
	public ShowForm= true; //To disable the form

	constructor(private _ajaxService: AjaxService,
		private _router:Router,
		) { }

	ngOnInit() {
		var getAllObj=JSON.parse(localStorage.getItem("user"));
		if(getAllObj != null && getAllObj != "failure"){
			this._router.navigate(['user-dashboard']); 
		}
		else if(this.userEmail == null){
			this._router.navigate(['login']); 
		}


	}

	upadatePassword(){
		if(this.isPasswordMatch ){
			var invite_obj={user:this.form,userEmail:this.userEmail};
			this._ajaxService.AjaxSubscribe("site/update-new-password",invite_obj,(result)=>
			{
				if(result.statusCode==200)
				{ 
					if(result.message == 'success'){
						localStorage.removeItem('userEmail');
						this.PasswordMsgClass='row text-center'; //timelogSuccessMsg
						this.PasswordSuccessMsg = 'Your password has been succefully changed. login to continue';
						this.ShowForm= false; //To disable the form
						} else{
						this.PasswordMsgClass='fielderror';
						this.PasswordSuccessMsg = 'There is a problem occured while updating your password.';
					}
				}
			})  
		}
		else
		{
        //Error Message for Mismatch Password
        this.isPasswordMatch=false;
    }
}

/**
 * @description Validates the password and confirmpassword equal ot not
 */
 public isPasswordMatching(){
 	if(this.form['confirmpassword'] !== this.form['password']){
 		this.isPasswordMatch=false;
 	}else{
 		this.isPasswordMatch=true;
 	}
 }



/**
 * @description Validates the password
 */
 public showPasswordHelper(){
 	this.showHelper=true;
 }


/**
 * @description Validates the password.
 */
 public hidePasswordHelper(){
 	this.showHelper=false;
 } 

}
