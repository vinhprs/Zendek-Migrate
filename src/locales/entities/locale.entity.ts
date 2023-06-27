import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Locale {
    @PrimaryColumn('int')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('varchar', {nullable: true, default: null})
    locale: string;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @Column('varchar', {nullable: true, default: null})
    native_name: string;

    @Column('varchar', {nullable: true, default: null})
    presentation_name: string;

    @Column('boolean', {nullable: false, default: false})
    rtl: boolean;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;

    @Column('boolean', {nullable: false, default: true})
    default: boolean;
}