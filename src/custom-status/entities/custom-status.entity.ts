import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class CustomStatus {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('varchar', {nullable: true, default: null})
    status_category: string;

    @Column('varchar', {nullable: true, default: null})
    raw_agent_label: string;

    @Column('varchar', {nullable: true, default: null})
    raw_end_user_label: string;

    @Column('varchar', {nullable: true, default: null})
    description: string;

    @Column('varchar', {nullable: true, default: null})
    raw_description: string;

    @Column('varchar', {nullable: true, default: null})
    end_user_description: string;

    @Column('varchar', {nullable: true, default: null})
    raw_end_user_description: string;

    @Column('boolean', {nullable: true, default: null})
    active: boolean

    @Column('boolean', {nullable: true, default: null})
    default: boolean

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;
}
