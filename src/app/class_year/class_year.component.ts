import { Component, OnInit } from "@angular/core";
import { BadgesService } from "../badges/badges.service";
import { BadgeUsersModel } from "../badges/badges.model";
import { ActivatedRoute, ParamMap, RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { UserCardComponent } from "../common/user-card/user-card.component";

@Component({
    selector: "app-class-year",
    templateUrl: "./class_year.component.html",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CardModule,
        ProgressSpinnerModule,
        // RouterLink,
        UserCardComponent
    ]
})
export class ClassYearComponent implements OnInit {
  badgeUsers: BadgeUsersModel | undefined;
  isLoading = false;
  backendUrl = environment.backendUrl;
  members: any = [];

  constructor(
    private badgesService: BadgesService,
    private route: ActivatedRoute
  ) {
    this.badgesService
      .getClassYear()
      .then((res) => {
        this.members = res;
        this.isLoading = false;
      })
      .catch((e) => {
        console.log(e);
        this.isLoading = false;
      });
  }

  ngOnInit() {}
}
