import { Field } from "src/field/entities/field.entity";
import { Via } from "src/via/entities/via.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryColumn()
    id: number;

    @Column({nullable: true, default: null})
    external_id: number;

    @Column({nullable: true, default: null})
    url: string;

    // @Column({nullable: true, default: null})
    // via: Via;

    @OneToOne(() => Via, via => via.ticket)
    via: Via;

    @Column({nullable: true, default: null})
    email: string;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;

    @Column({nullable: true, default: null})
    type: string;

    @Column({nullable: true, default: null})
    subject: string;

    @Column({nullable: true, default: null})
    raw_subject: string;

    @Column({nullable: true, default: null})
    description: string;

    @Column({nullable: true, default: null})
    priority: string;

    @Column({nullable: true, default: null})
    status: string;

    @Column({nullable: true, default: null})
    recipient: string;

    @Column({nullable: true, default: null})
    requester_id: number;

    @Column({nullable: true, default: null})
    submitter_id: number;

    @Column({nullable: true, default: null})
    assignee_id: number;

    @Column({nullable: true, default: null})
    organization_id: number;

    @Column({nullable: true, default: null})
    group_id: number;

    @Column({nullable: true, default: null, array: true})
    collaborator_ids: number;

    @Column({nullable: true, default: null, array: true})
    follower_ids: number;

    @Column({nullable: true, default: null, array: true})
    email_cc_ids: number;

    @Column({nullable: true, default: null})
    forum_topic_id: number;

    @Column({nullable: true, default: null})
    problem_id: number;

    @Column({nullable: true, default: null})
    has_incidents: boolean;

    @Column({nullable: true, default: null})
    is_public: boolean;

    @Column({nullable: true, default: null})
    due_at: Date;

    @Column({nullable: true, default: null, array: true})
    tags: string;

    @OneToOne(() => Field, custom_fields => custom_fields.ticket)
    custom_fields: Field;

    @Column({nullable: true, default: null})
    satisfaction_rating: number;

    @Column({nullable: true, default: null, array: true})
    sharing_agreement_ids: number;

    @Column({nullable: true, default: null})
    custom_status_id: number;

    @OneToOne(() => Field, fields => fields.ticket)
    fields: Field;

    @Column({nullable: true, default: null, array: true})
    followup_ids: number;

    @Column({nullable: true, default: null})
    brand_id: number;

    @Column({nullable: true, default: null})
    allow_channelback: boolean;

    @Column({nullable: true, default: null})
    allow_attachments: boolean;

    @Column({nullable: true, default: null})
    from_messaging_channel: boolean

    @Column({nullable: true, default: null})
    generated_timestamp: number;

}