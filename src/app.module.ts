import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './organizations/organizations.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachments } from './attachments/entities/attachment.entity';
import { Organization } from './organizations/entities/organization.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password:  process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Attachments,
        Organization
      ],
      synchronize: true,
    }),
    UsersModule,
    OrganizationsModule,
    AttachmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
