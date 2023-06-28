import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';

@Injectable()
export class BrandService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/brands';

  constructor(
    private readonly api: Api,
  ) {}

  async migrate(): Promise<any> {
    const data = await this.old_brands();
    const new_brands = await this.new_brands();
    const new_brand_names = new_brands.map((brand) => brand.name);
    for(const org of data) {
      if (!new_brand_names.includes(org.name)) {
        const request = JSON.parse(JSON.stringify({brand: {
          name: org.name,
          subdomain: org.subdomain + "new"
        }}));
        await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
      }
    }
  }

  async old_brands(): Promise<Array<any>> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    return data.brands;
  }

  async new_brands(): Promise<Array<any>> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data.brands;
  }
}
