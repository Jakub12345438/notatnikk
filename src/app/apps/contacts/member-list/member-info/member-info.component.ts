import { Component, Input, OnInit } from '@angular/core';
import { MemberInfo } from '../../shared/contacts.model';
import {UserInfo} from "angular-oauth2-oidc";
import {AppUser, AppUserDTO} from "../../../../auth/account/shared/appuser.model";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Todo} from "../../../todo/shared/todo.model";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

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
