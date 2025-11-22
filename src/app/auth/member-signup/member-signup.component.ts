import { Component, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {TitleService} from '../../services/title.service';
import {AuthService} from '../auth.service';
import { MessageService } from 'primeng/api';
import {Router} from '@angular/router';
import {patternValidator} from '../../../validators/pattern.validator';
import {AuthRegisterModel} from '../auth-data.model';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule, DatePipe } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-member-signup',
    templateUrl: './member-signup.component.html',
    imports: [
        CommonModule,
        StepperModule,
        InputTextModule,
        ReactiveFormsModule,
        DatePickerModule,
        SelectModule,
        ButtonModule,
    ]
})
export class MemberSignupComponent implements OnInit {
  currentStep = 0;
  isLoading = false;
  accountInfo = this.fb.group({
    email: ['', [Validators.required, Validators.email, patternValidator(/.edu$/)]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });
  personalInfo = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    personalEmail: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    address: this.fb.group({
      address1: ['', [Validators.required, Validators.minLength(2)]],
      address2: ['', []],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(5)]]
    }),
    phone: ['', [Validators.required, Validators.minLength(10)]],
  });
  schoolInfo = this.fb.group({
    schoolName: ['', [Validators.required, Validators.minLength(2)]],
    address: this.fb.group({
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
    }),
    degree: ['', [Validators.required, Validators.minLength(2)]],
    graduationYear: ['', [Validators.required, Validators.minLength(4)]],
    schoolYear: ['', [Validators.required, Validators.minLength(1)]],
    major: ['', [Validators.required, Validators.minLength(2)]],
    doubleMajor: ['', []],
  });
  socialInfo = this.fb.group({
      facebook: ['', [Validators.required, Validators.minLength(10)]],
      instagram: ['', []],
      linkedin: ['', []]
    });
  states_us: string[] = [
    'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW',
    'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA', 'AP'
  ];
  degreeOptions = [
    { label: 'Bachelor', value: 'bachelor' },
    { label: 'Master', value: 'master' },
    { label: 'PhD', value: 'phd' },
    { label: 'Other', value: 'other' }
  ];
  schoolYearOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5 or more', value: '5' }
  ];
  translationText$: Observable<any>;

  constructor(
    private fb: UntypedFormBuilder,
    private titleService: TitleService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private languageService: LanguageService,
  ) { 
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit() {
    this.titleService.setTitle('AMSA Registration - Member');
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  submitForm() {
    const a_info = this.accountInfo.value;
    const p_info = this.personalInfo.value;
    const u_info = this.schoolInfo.value;
    const s_info = this.socialInfo.value;
    this.isLoading = true;
    const user: AuthRegisterModel = {
      email: a_info['email'],
      password: a_info['password'],
      firstName: p_info['firstname'],
      lastName: p_info['lastname'],
      birthday: p_info['birthDate'],
      address1: p_info['address']['address1'],
      address2: p_info['address']['address2'],
      city: p_info['address']['city'],
      state: p_info['address']['state'],
      zipCode: p_info['address']['zip'],
      phoneNumber: p_info['phone'],
      personalEmail: p_info['personalEmail'],
      facebook: s_info['facebook'],
      linkedin: s_info['linkedin'],
      instagram: s_info['instagram'],
      schoolYear: u_info['schoolYear'],
      degreeLevel: u_info['degree'],
      graduationYear: u_info['graduationYear'],
      major: u_info['major'],
      major2: u_info['doubleMajor'],
      schoolName: u_info['schoolName'],
      schoolState: u_info['address']['state'],
      schoolCity: u_info['address']['city'],
    };

    this.authService.createUser(user).then((res) => {
      this.isLoading = false;
      console.log(res.message);
      if (res.message === 'User created!') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Та амжилттай бүртгүүлсэн!', life: 5000 });
        // this.router.navigate(['/auth/verify/' + a_info['email']]);
      }
      console.log(res.message);

    }).catch((err) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: err.message, life: 5000 });
      console.log(err.message);
      this.authService.setAuthListener(false);
      this.authService.setLevelListener(0);
      this.isLoading = false;
    });
  }

}
