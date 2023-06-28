import { CustomField } from "src/custom-field/entities/custom-field.entity";
import { Field } from "src/field/entities/field.entity";
import { Via } from "src/via/entities/via.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryColumn('bigint')
    id: number;

    @Column('bigint', {nullable: true, default: null})
    external_id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    // @ManyToOne(() => Via, via => via.ticket)
    // via: Via;

    // @Column('varchar', {nullable: true, default: null})
    // via: Via;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;

    @Column('varchar', {nullable: true, default: null})
    type: string;

    @Column('varchar', {nullable: true, default: null})
    subject: string;

    @Column('varchar', {nullable: true, default: null})
    raw_subject: string;

    @Column('varchar', {nullable: true, default: null})
    description: string;

    @Column('varchar', {nullable: true, default: null})
    priority: string;

    @Column('varchar', {nullable: true, default: null})
    status: string;

    @Column('varchar', {nullable: true, default: null})
    recipient: string;

    @Column('bigint', {nullable: true, default: null})
    requester_id: number;

    @Column('bigint', {nullable: true, default: null})
    submitter_id: number;

    @Column('bigint', {nullable: true, default: null})
    assignee_id: number;

    @Column('bigint', {nullable: true, default: null})
    organization_id: number;

    @Column('bigint', {nullable: true, default: null})
    group_id: number;

    @Column('bigint', {nullable: true, default: null, array: true})
    collaborator_ids: number[];

    @Column('bigint', {nullable: true, default: null, array: true})
    follower_ids: number[];

    @Column('bigint', {nullable: true, default: null, array: true})
    email_cc_ids: number[];

    @Column('bigint', {nullable: true, default: null})
    forum_topic_id: number;

    @Column('bigint', {nullable: true, default: null})
    problem_id: number;

    @Column('boolean', {nullable: true, default: false})
    has_incidents: boolean;

    @Column('boolean', {nullable: true, default: true})
    is_public: boolean;

    @Column('timestamp', {nullable: true, default: null})
    due_at: Date;

    @Column('varchar', {nullable: true, default: null, array: true})
    tags: string[];

    @ManyToMany(() => CustomField, custom_fields => custom_fields.ticket, {
        cascade: [
            'insert',
            'update',
        ]
    })
    custom_fields: CustomField[];

    @Column('bigint', {nullable: true, default: null})
    satisfaction_rating: number;

    @Column('bigint', {nullable: true, default: null, array: true})
    sharing_agreement_ids: number[];

    @Column('bigint', {nullable: true, default: null})
    custom_status_id: number;

    @ManyToMany(() => Field, fields => fields.ticket, {
        cascade: [
            'insert',
            'update',
        ]
    })
    fields: Field[];

    @Column('bigint', {nullable: true, default: null, array: true})
    followup_ids: number[];

    @Column('bigint', {nullable: true, default: null})
    brand_id: number;

    @Column('boolean', {nullable: true, default: null})
    allow_channelback: boolean;

    @Column('boolean', {nullable: true, default: null})
    allow_attachments: boolean;

    @Column('boolean', {nullable: true, default: null})
    from_messaging_channel: boolean

    @Column('bigint', {nullable: true, default: null})
    generated_timestamp: number;
}