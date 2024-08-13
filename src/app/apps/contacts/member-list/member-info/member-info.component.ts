import { Component, Input, OnInit } from '@angular/core';
import { MemberInfo } from '../../shared/contacts.model';
import {UserInfo} from "angular-oauth2-oidc";
import {AppUser, AppUserDTO} from "../../../../auth/account/shared/appuser.model";

@Component({
  selector: 'app-contact-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {

  @Input() member: MemberInfo = {};
  @Input() appUser: AppUserDTO = {};

  constructor () { }

  ngOnInit(): void {
  }

}
