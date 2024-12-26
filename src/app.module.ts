import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResearchCollabModule } from './modules/research-collab/research-collab.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [DatabaseConfig], }),
    TypeOrmModule.forRootAsync({
      useFactory: DatabaseConfig
    }),
    ResearchCollabModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
