import {async, TestBed} from '@angular/core/testing';
import { ShowcaseComponent } from './showcase.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowcaseMeterComponent } from './components/meter/showcase-meter.component';
import { BrowserModule } from '@angular/platform-browser';
import { SystelabMetersModule } from 'systelab-meters';
import { FormsModule } from '@angular/forms';
import { ShowcaseMetersComponent } from './components/showcase-meters.component';
import { ShowcaseTitleComponent } from './components/showcase-title.component';


describe('ShowCaseComponent', () => {
	let fixture;
	let component;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports:      [
				BrowserModule,
				BrowserAnimationsModule,
				FormsModule,
				SystelabMetersModule
			],
			declarations: [
				ShowcaseComponent,
				ShowcaseTitleComponent,
				ShowcaseMeterComponent,
				ShowcaseMetersComponent
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		component = fixture.debugElement.componentInstance;
	}));

	it('should create the app', (() => {
		expect(component).toBeTruthy();
	}));

});
