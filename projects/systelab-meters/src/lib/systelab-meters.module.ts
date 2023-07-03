import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigitalMeterComponent } from './meter/digital/digital-meter.component';
import { RadialMeterComponent } from './meter/radial/radial-meter.component';
import { LinearMeterComponent } from './meter/linear/linear-meter.component';



@NgModule({
	imports: [
		CommonModule,
		FormsModule,
	],
	declarations: [
		DigitalMeterComponent,
		RadialMeterComponent,
		LinearMeterComponent,
	],
	exports: [
		DigitalMeterComponent,
		RadialMeterComponent,
		LinearMeterComponent,
	]
})
export class SystelabMetersModule {
	static forRoot(entryComponents?: Array<Type<any> | any[]>): ModuleWithProviders<SystelabMetersModule> {
		return {
			ngModule: SystelabMetersModule
		};
	}
}
