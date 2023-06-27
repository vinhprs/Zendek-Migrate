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
import { LocalesModule } from './locales/locales.module';
import { Locale } from './locales/entities/locale.entity';
import { GroupsModule } from './groups/groups.module';
import { Groups } from './groups/entities/group.entity';
import { CustomRolesModule } from './custom-roles/custom-roles.module';

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
        Organization,
        Locale,
        Groups
      ],
      synchronize: true,
    }),
    UsersModule,
    OrganizationsModule,
    AttachmentsModule,
    LocalesModule,
    GroupsModule,
    CustomRolesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
