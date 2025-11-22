import { Component, OnInit, ViewChild } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import {TabsModule} from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { UserCardComponent } from '../../common/user-card/user-card.component';
import { FormsModule } from '@angular/forms';

export interface Tulbur {
  hicheeluud: string;
  une: number;
}


const ELEMENT_DATA: Tulbur[] = [
  {
    hicheeluud: "Graduate Application Process",
    une: 100000,
  },
  {
    hicheeluud: "Undergraduate Application Process",
    une: 100000,
  },
  {
    hicheeluud: "TOEFL",
    une: 100000,
  },
  {
    hicheeluud: "PRE-TOEFL",
    une: 100000,
  },
  {
    hicheeluud: "SAT Reading and Writing",
    une: 100000,
  },
  {
    hicheeluud: "SAT Math",
    une: 100000,
  },
  {
    hicheeluud: "Introduction to Computer Science",
    une: 100000,
  },
  {
    hicheeluud: "Introduction to Physics",
    une: 100000,
  },
  {
    hicheeluud: "Introduction to Economics",
    une: 100000,
  },
  {
    hicheeluud: "Introduction to Statistics",
    une: 100000,
  },
];

@Component({
    selector: 'app-buop',
    templateUrl: './buop.component.html',
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        ButtonModule,
        UserCardComponent
    ]
})

export class BuopComponent implements OnInit {
  undsen_teachers = [{
    name: "Namuungoo Enkhbat",
    userId: 1,
    schoolName: "Harvard College",
    profilePic: "assets/images/Namuungoo.jpeg",
    position: "SAT Reading and Writing",
    content: "Төгсөх он: 2025."
  },  {
    name: "Tsolmon Bazarragchaa",
    userId: 2,
    schoolName: "Massachusetts Institute of Technology",
    profilePic: "assets/images/AMSA_logo_1024.png",
    position: "SAT Math",
    content: "Төгсөх он: 2024, Мэргэжил: Физик."
  },{
    name: "Bayasgalan Kherlen",
    userId: 3,
    schoolName: "Colgate University",
    profilePic: "assets/images/Bayasgalan Kherlen.jpg",
    position: "TOEFL IBT",
    content: "Төгсөх он: 2025, Мэргэжил: Эдийн засаг."
  },{
    name: "Jessica Oldov",
    userId: 4,
    schoolName: "Duke University",
    profilePic: "assets/images/JessicaOldov.png",
    position: "Undergraduate Application Process",
    content: "Төгсөх он: 2025."
  },{
    name: "Battulga Odgerel",
    userId: 5,
    schoolName: "John Hopkins University",
    profilePic: "assets/images/BattulgaOdgerel.png",
    position: "Graduate Application Process",
    content: "Төгссөн он: 2019, Мэргэжил: Олон улсын эдийн засаг."
  },  {
    name: "Anu-Ujin Oyungerel",
    userId: 6,
    schoolName: "Bay Atlantic University",
    profilePic: "assets/images/AMSA_logo_1024.png",
    position: "Pre-TOEFL",
    content: "Төгсөх он: 2022, Мэргэжил: Олон улсын харилцаа болон Улс төр судлал."
  }
 ];

college_teachers = [{
  name: "Batmend Batsaikhan",
  userId: 7,
  schoolName: "Carleton College",
  profilePic: "assets/images/batmend_photo_amsa.jpeg",
  position: "Introduction to Computer Science",
  content: "Төгсөх он: 2024, Мэргэжил: Комьютерийн шинжлэх ухаан."
  },
 {
  name: "Ider Bayar",
  userId: 8,
  schoolName: "Columbia University",
  profilePic: "assets/images/AMSA_logo_1024.png",
  position: "Introduction to Physics",
  content: "Төгсөх он: 2022, Мэргэжил: Эдийн засаг болон Философи."
  },{
      name: "Suvd Khaliun",
      userId: 9,
      schoolName: "Cornell University",
      profilePic: "assets/images/Suvd.jpeg",
      position: "Introduction to Economics",
      content: "Төгсөх он: 2022, Мэргэжил: Эдийн засаг."
  },{
    name: "Khaliun Battogtokh",
    userId: 10,
    schoolName: "University of Nebraska-Lincoln",
    profilePic: "assets/images/Khaliun Battogtokh.jpg",
    position: "Introduction to Statistics",
    content: "Төгсөх он: 2022, Мэргэжил: Эдийн засаг болон Статистик. "
  }
 ]
  ;

  displayedColumns: string[] = ['Хичээлүүд', 'Үнэ'];
  dataSource = ELEMENT_DATA;
  translationText$: Observable<any>;
  
  activeTab: any = "0";
  
  constructor(
    private titleService: TitleService,
    private languageService: LanguageService,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit() {
    this.titleService.setTitle('BUOP')
  }

  openDonationLink() {
    window.open('https://www.gofundme.com/f/d5wbpa-buop/donate', '_blank');
  }

}
