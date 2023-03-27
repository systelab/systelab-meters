import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterComponent } from './meter/meter.component';
import { FormsModule } from '@angular/forms';



@NgModule({
	imports: [
		CommonModule,
		FormsModule,
	],
	declarations: [
		MeterComponent,
	],
	exports: [
		MeterComponent,
	]
})
export class SystelabMetersModule {
	static forRoot(entryComponents?: Array<Type<any> | any[]>): ModuleWithProviders<SystelabMetersModule> {
		return {
			ngModule: SystelabMetersModule
		};
	}
}
