import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ShowcaseComponent } from './showcase.component';
import { FormsModule } from '@angular/forms';
import { ShowcaseTitleComponent } from './components/showcase-title.component';
import { ShowcaseMeterComponent } from './components/meter/showcase-meter.component';
import { ShowcaseMetersComponent } from './components/showcase-meters.component';
import { SystelabMetersModule } from "systelab-meters";

@NgModule({
	imports:      [
		BrowserModule,
		FormsModule,
		SystelabMetersModule
	],
	declarations: [
		ShowcaseComponent,
		ShowcaseTitleComponent,
		ShowcaseMeterComponent,
		ShowcaseMetersComponent
	],
	bootstrap:    [ShowcaseComponent]
})
export class ShowcaseModule {
}

export { ShowcaseComponent } from './showcase.component';
