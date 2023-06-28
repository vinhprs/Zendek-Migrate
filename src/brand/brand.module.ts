import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { HttpModule } from '@nestjs/axios';
import { Api } from 'src/fetch/zendesk';

@Module({
    imports: [
        HttpModule
    ],
    providers: [BrandService, Api],
    exports: [BrandService]
})
export class BrandModule {}