import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organization {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @Column('boolean', {nullable: false})
    shared_tickets: boolean;

    @Column('boolean', {nullable: false})
    shared_comments: boolean;

    @Column('varchar', {nullable: true, default: null})
    external_id: string;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;

    @Column('varchar', {nullable: true, array: true})
    domain_names: string[];

    @Column('varchar', {nullable: true, default: null})
    details: string;

    @Column('varchar', {nullable: true, default: null})
    notes: string;

    @Column('bigint', {nullable: true, default: null})
    group_id: number;

    @Column('varchar', {nullable: true, array: true})
    tags: string[];

}