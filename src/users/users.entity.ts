import { Attachments } from "src/attachments/entities/attachment.entity";
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @Column('varchar', {nullable: true, default: null})
    email: string;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;

    @Column('varchar', {nullable: true, default: null})
    time_zone: string;

    @Column('varchar', {nullable: true, default: null})
    iana_time_zone: string;

    @Column('varchar', {nullable: true, default: null})
    phone: string;

    @Column('varchar', {nullable: true, default: null})
    shared_phone_number: string;

    @OneToOne(() => Attachments, (photo: Attachments) => photo.user, {
        cascade: [
            "insert",
            "update"
        ]
    })
    photo?: Attachments;

    @Column('int', {nullable: true, default: null})
    locale_id: number;

    @Column('varchar', {nullable: true, default: null})
    locale: string;

    @Column('bigint', {nullable: true, default: null})
    organization_id: number;

    @Column('varchar', {nullable: true, default: null})
    role: string;

    @Column('boolean', {nullable: false, default: false})
    verified: boolean;

    @Column('bigint', {nullable: true, default: null})
    external_id: number;

    @Column('varchar', {nullable: true, array: true})
    tags: string[];

    @Column('varchar', {nullable: true, default: null})
    alias: string; 

    @Column('boolean', {nullable: false, default: true})
    active: boolean;

    @Column('boolean', {nullable: false, default: false})
    shared: boolean;

    @Column('boolean', {nullable: false, default: false})
    shared_agent: boolean;

    @Column('timestamp', {nullable: true, default: null})
    last_login_at: Date;

    @Column('boolean', {nullable: true, default: null})
    two_factor_auth_enabled: boolean;

    @Column('varchar', {nullable: true, default: null})
    signature: string;

    @Column('varchar', {nullable: true, default: null})
    details: string;

    @Column('varchar', {nullable: true, default: null})
    notes: string;

    @Column('int', {nullable: true, default: null})
    role_type: number;

    @Column('bigint', {nullable: true, default: null})
    custom_role_id: number;

    @Column('boolean', {nullable: false, default: false})
    moderator: boolean;

    @Column('varchar', {nullable: true, default: null})
    ticket_restriction: string;

    @Column('boolean', {nullable: false, default: false})
    only_private_comments: boolean;

    @Column('boolean', {nullable: false})
    restricted_agent: boolean;

    @Column('boolean', {nullable: false, default: false})
    suspended: boolean;

    @Column('bigint', {nullable: true, default: null})
    default_group_id: number;

    @Column('boolean', {nullable: false, default: false})
    report_csv: boolean;

}