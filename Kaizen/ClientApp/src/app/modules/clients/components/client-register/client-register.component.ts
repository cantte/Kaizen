import { Component, OnInit } from '@angular/core';
import { ClientService } from '@modules/clients/services/client.service';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { IForm } from '@core/models/form';
import { CharactersValidators } from '@shared/validators/characters-validators';
import { User } from '@core/models/user';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { ClientExistsValidator } from '@shared/validators/client-exists-validator';
import { Client } from '@modules/clients/models/client';
import { NotificationsService } from '@shared/services/notifications.service';
import { HttpErrorHandlerService } from '@shared/services/http-error-handler.service';
import { CLIENT_ROLE } from '@global/roles';

@Component({
	selector: 'app-client-register',
	templateUrl: './client-register.component.html',
	styleUrls: [ './client-register.component.css' ]
})
export class ClientRegisterComponent implements OnInit, IForm {
	clientForm: FormGroup;
	legalPersonForm: FormGroup;
	contactPersonForm: FormGroup;
	contactPeopleForm: FormGroup;
	ubicationForm: FormGroup;

	public get controls(): { [key: string]: AbstractControl } {
		return this.clientForm.controls;
	}

	public get legal_controls(): { [key: string]: AbstractControl } {
		return this.legalPersonForm.controls;
	}

	public get contact_controls(): { [key: string]: AbstractControl } {
		return this.contactPersonForm.controls;
	}

	public get ubication_controls(): { [key: string]: AbstractControl } {
		return this.ubicationForm.controls;
	}

	public get contact_people_controls(): { [key: string]: AbstractControl } {
		return this.contactPeopleForm.controls;
	}

	constructor(
		private clientService: ClientService,
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private clientValidator: ClientExistsValidator,
		private notificationsService: NotificationsService,
		private httpErrorHandler: HttpErrorHandlerService
	) {}

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.initClientForm();
		this.initLegalPersonForm();
		this.initContactForm();
		this.initContactPeopleForm();
		this.initUbicationForm();
	}

	private initUbicationForm() {
		this.ubicationForm = this.formBuilder.group({
			city: [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(40) ] ],
			neighborhood: [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(40) ] ],
			street: [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(40) ] ]
		});
	}

	private initContactForm() {
		this.contactPersonForm = this.formBuilder.group({
			firstPhonenumber: [
				'',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(10),
					CharactersValidators.numericCharacters
				]
			],
			secondPhonenumber: [
				'',
				[ Validators.minLength(10), Validators.maxLength(10), CharactersValidators.numericCharacters ]
			],
			firstLandline: [
				'',
				[ Validators.minLength(10), Validators.maxLength(15), CharactersValidators.numericCharacters ]
			],
			secondLandline: [
				'',
				[ Validators.minLength(10), Validators.maxLength(15), CharactersValidators.numericCharacters ]
			],
			email: [ '', [ Validators.required, Validators.email ] ]
		});
	}

	private initContactPeopleForm() {
		this.contactPeopleForm = this.formBuilder.group({
			person_name_1: [ '', Validators.required, Validators.maxLength(50) ],
			person_phonenumber_1: [
				'',
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(10),
				CharactersValidators.numericCharacters
			],
			person_name_2: [ '', Validators.required, Validators.maxLength(50) ],
			person_phonenumber_2: [
				'',
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(10),
				CharactersValidators.numericCharacters
			]
		});
	}

	private initLegalPersonForm() {
		this.legalPersonForm = this.formBuilder.group({
			NIT: [
				'',
				[
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(30),
					CharactersValidators.numericCharacters
				]
			],
			tradeName: [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ] ],
			businessName: [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ] ]
		});
	}

	private initClientForm() {
		this.clientForm = this.formBuilder.group({
			id: [
				'',
				{
					validators: [
						Validators.required,
						Validators.minLength(8),
						Validators.maxLength(10),
						CharactersValidators.numericCharacters
					],
					asyncValidators: [ this.clientValidator.validate.bind(this.clientValidator) ],
					updateOn: 'blur'
				}
			],
			firstName: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(20),
					CharactersValidators.alphabeticCharacters
				]
			],
			secondName: [
				'',
				[ Validators.minLength(2), Validators.maxLength(20), CharactersValidators.alphabeticCharacters ]
			],
			lastName: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(20),
					CharactersValidators.alphabeticCharacters
				]
			],
			secondLastname: [
				'',
				[ Validators.minLength(2), Validators.maxLength(20), CharactersValidators.alphabeticCharacters ]
			],
			clientType: [ '', [ Validators.required ] ]
		});
	}

	onSubmit(user: User): void {
		if (user && this.allFormsValid()) {
			user.email = this.contact_controls['email'].value;
			user.phonenumber = this.contact_controls['firstPhonenumber'].value;
			user.role = CLIENT_ROLE;

			this.authService.registerUser(user).subscribe((userRegister) => {
				const client: Client = this.mapClient(userRegister.id);

				this.clientService.saveClient(client).subscribe((clientRegister) => {
					this.notificationsService.add(`Cliente ${clientRegister.firstName} registrado con éxito`, 'OK');
					this.authService.setCurrentUser(userRegister);
					window.location.reload();
				});
			});
		}
	}

	allFormsValid(): boolean {
		return (
			this.clientForm.valid &&
			this.contactPersonForm.valid &&
			this.ubicationForm.valid &&
			(
				this.controls['clientType'].value == 'JuridicPerson' ? this.legalPersonForm.valid :
				true)
		);
	}

	mapClient(user_id: string): Client {
		let client: Client = {
			id: this.controls['id'].value,
			firstName: this.controls['firstName'].value,
			secondName: this.controls['secondName'].value,
			lastName: this.controls['lastName'].value,
			secondLastName: this.controls['secondLastname'].value,
			clientType: this.controls['clientType'].value,
			firstPhoneNumber: this.contact_controls['firstPhonenumber'].value,
			secondPhoneNumber: this.contact_controls['secondPhonenumber'].value,
			firstLandline: this.contact_controls['firstLandline'].value,
			secondLandline: this.contact_controls['secondLandline'].value,
			contactPeople: [
				{
					name: this.contact_people_controls['person_name_1'].value,
					phonenumber: this.contact_people_controls['person_phonenumber_1'].value
				},
				{
					name: this.contact_people_controls['person_name_2'].value,
					phonenumber: this.contact_people_controls['person_phonenumber_2'].value
				}
			],
			clientAddress: {
				city: this.ubication_controls['city'].value,
				neighborhood: this.ubication_controls['neighborhood'].value,
				street: this.ubication_controls['street'].value
			},
			userId: user_id
		};

		if (client.clientType == 'JuridicPerson') {
			client.NIT = this.legal_controls['NIT'].value;
			client.busninessName = this.legal_controls['businessName'].value;
			client.tradeName = this.legal_controls['tradeName'].value;
		}

		return client;
	}
}
