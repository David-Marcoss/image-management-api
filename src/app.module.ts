import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/v1/user/user.module";
import { AuthModule } from "./modules/v1/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './modules/v1/cloudinary/cloudinary.module';
import { ImagesModule } from './modules/v1/images/images.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [
		// modulo config para carregar variaveis de ambiente
		ConfigModule.forRoot({ isGlobal: true }),
		// modulo de schedule para agendar execucao de funcoes
		ScheduleModule.forRoot(),
		UserModule,
		AuthModule,
		DatabaseModule,
		CloudinaryModule,
		ImagesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
