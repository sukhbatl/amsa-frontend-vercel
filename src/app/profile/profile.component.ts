import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ProfileModel, UpdatedProfileModel } from './profile.model';
import { TitleService } from '../services/title.service';
import { environment } from '../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { mimeType } from '../../validators/mime-type.validator';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    ListboxModule,
    CardModule,
    DividerModule,
    AccordionModule,
    TabsModule,
    ProgressSpinnerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // CreatePostComponent,
    // UserProfileComponent,
    RouterLink,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [MessageService]
})

export class ProfileComponent implements OnInit {
  isLoading = false;
  private authLevelListenerSubs?: Subscription;
  userLevel = 0;
  profile: ProfileModel | undefined;
  // profile = this.profileService.getMyProfile();
  updatedProfile: ProfileModel | undefined;
  backendUrl = environment.backendUrl;
  userOptions = 'profile';
  selectedSubTab = 'personal';
  selectedUpdateSubTab = 'update';
  selectedPhotoSubTab = 'photo';
  selectedPasswordSubTab = 'password';
  isUploadButtonDisabled = true;

  profilePicturePreviewUrl: string | ArrayBuffer | undefined;
  personalInfo: UntypedFormGroup | undefined;
  schoolInfo: UntypedFormGroup | undefined;
  socialInfo: UntypedFormGroup | undefined;
  updatePictureForm: UntypedFormGroup | undefined;
  changePasswordForm: UntypedFormGroup | undefined;

  states_us: { value: string }[] = [
    { value: 'AL' }, { value: 'AK' }, { value: 'AS' }, { value: 'AZ' }, { value: 'AR' }, { value: 'CA' }, { value: 'CO' }, { value: 'CT' }, { value: 'DE' }, { value: 'DC' }, { value: 'FM' }, { value: 'FL' }, { value: 'GA' }, { value: 'GU' }, { value: 'HI' }, { value: 'ID' }, { value: 'IL' }, { value: 'IN' }, { value: 'IA' }, { value: 'KS' }, { value: 'KY' }, { value: 'LA' },
    { value: 'ME' }, { value: 'MH' }, { value: 'MD' }, { value: 'MA' }, { value: 'MI' }, { value: 'MN' }, { value: 'MS' }, { value: 'MO' }, { value: 'MT' }, { value: 'NE' }, { value: 'NV' }, { value: 'NH' }, { value: 'NJ' }, { value: 'NM' }, { value: 'NY' }, { value: 'NC' }, { value: 'ND' }, { value: 'MP' }, { value: 'OH' }, { value: 'OK' }, { value: 'OR' }, { value: 'PW' },
    { value: 'PA' }, { value: 'PR' }, { value: 'RI' }, { value: 'SC' }, { value: 'SD' }, { value: 'TN' }, { value: 'TX' }, { value: 'UT' }, { value: 'VT' }, { value: 'VI' }, { value: 'VA' }, { value: 'WA' }, { value: 'WV' }, { value: 'WI' }, { value: 'WY' }, { value: 'AE' }, { value: 'AA' }, { value: 'AP' }
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private profileService: ProfileService,
    private titleService: TitleService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.titleService.setTitle('My Profile');
    this.isLoading = true;
    this.updatePictureForm = this.fb.group({
      image: [null, [Validators.required], [mimeType]]
    });
    this.changePasswordForm = this.fb.group({
      old: ['', [Validators.required]],
      new: ['', [Validators.required]]
    });
    this.profileService.getMyProfile().then((res) => {
      this.profile = res;
      this.personalInfo = this.fb.group({
        email: [this.profile?.email, [Validators.required]],
        firstname: [this.profile?.firstName, [Validators.required]],
        lastname: [this.profile?.lastName, [Validators.required]],
        personalEmail: [this.profile?.personalEmail, [Validators.required]],
        birthDate: [this.profile?.birthday, [Validators.required]],
        address: this.fb.group({
          address1: [this.profile?.address1, [Validators.required]],
          address2: [this.profile?.address2, [Validators.required]],
          city: [this.profile?.city, [Validators.required]],
          state: [this.profile?.state, [Validators.required]],
          zip: [this.profile?.zipCode, [Validators.required]]
        }),
        phone: [this.profile?.phoneNumber, [Validators.required]],
      });

      this.schoolInfo = this.fb.group({
        schoolName: [this.profile?.schoolName, [Validators.required]],
        address: this.fb.group({
          city: [this.profile?.schoolCity, [Validators.required]],
          state: [this.profile?.schoolState, [Validators.required]],
        }),
        degree: [this.profile?.degreeLevel, [Validators.required]],
        graduationYear: [this.profile?.graduationYear, [Validators.required]],
        schoolYear: [this.profile?.schoolYear, [Validators.required]],
        major: [this.profile?.major, [Validators.required]],
        doubleMajor: [this.profile?.major2, []],
      });

      this.socialInfo = this.fb.group({
        facebook: [this.profile?.facebook, []],
        instagram: [this.profile?.instagram, []],
        linkedin: [this.profile?.linkedin, []]
      });

      this.updatedProfile = Object.assign({}, this.profile);

      this.authLevelListenerSubs = this.authService.getAuthLevelListener().subscribe(
        level => {
          this.userLevel = level;
        }
      );
      this.userLevel = this.authService.getLevel();

      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  navigateProfile(options: string) {
    this.userOptions = options;
  }

  processFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.updatePictureForm?.patchValue({ image: file });
    this.updatePictureForm?.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePicturePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updatePassword() {
    const body = {
      currentPassword: this.changePasswordForm?.value['old'],
      newPassword: this.changePasswordForm?.value['new']
    };
    this.profileService.updatePassword(body).then((result) => {
      this.confirmationService.confirm({
        message: result.message,
        header: 'Success',
        icon: 'pi pi-check',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => { }
      });
    });
  }

  updateProfile() {
    const p_info = this.personalInfo?.value;
    const u_info = this.schoolInfo?.value;
    const s_info = this.socialInfo?.value;

    const newUser: UpdatedProfileModel = {
      email: p_info['email'],
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
      bio: p_info['bio'],
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

    this.profileService.updateUserProfile(newUser).then((res) => {
      if (newUser.email !== this.profile?.email) {
        this.authService.logout();
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully!',
        life: 3000
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update profile',
        life: 3000
      });
    });
  }

  updateProfilePic() {
    this.isUploadButtonDisabled = true;
    this.profileService.changeProfilePicture(this.updatePictureForm?.value.image).then((res) => {
      this.onImageUploadSuccess();
      if (this.profile) {
        this.profile.profilePic = res['profilePic'];
      }

    }).catch(() => {
      this.onImageUploadError();
      this.isUploadButtonDisabled = false;
    });
  }

  private onImageUploadSuccess() {
    this.isUploadButtonDisabled = false;
    this.confirmationService.confirm({
      message: 'Зураг амжилттай солигдлоо!',
      header: 'Success',
      icon: 'pi pi-check',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { }
    });
  }

  private onImageUploadError() {
    this.isUploadButtonDisabled = false;
    this.confirmationService.confirm({
      message: 'Зураг солиход алдаа гарлаа!',
      header: 'Error',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return '';
    }
    // If it's already a full URL (starts with http/https), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, prepend the backend URL
    return this.backendUrl + imagePath;
  }

  ngOnInit() {

  }

}
