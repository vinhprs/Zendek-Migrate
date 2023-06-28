import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';

@Injectable()
export class BrandService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
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
        await this.api.post(this.DOMAIN_WOWI, this.PATH, request)
      }
    }
  }

  async old_brands(): Promise<Array<any>> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.brands;
  }

  async new_brands(): Promise<Array<any>> {
    const data = await this.api.get_new(this.DOMAIN_WOWI, this.PATH);
    return data.brands;
  }
}
