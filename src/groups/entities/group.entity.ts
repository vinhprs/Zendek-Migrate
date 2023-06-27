import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Groups {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('boolean', {nullable: true, default: true})
    is_public: boolean;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @Column('varchar', {nullable: true, default: null})
    description: string;

    @Column('boolean', {nullable: true, default: true})
    default: boolean;

    @Column('boolean', {nullable: true, default: false})
    deleted: boolean;

    @Column('timestamp', {nullable: true, default: null})
    created_at: Date;

    @Column('timestamp', {nullable: true, default: null})
    updated_at: Date;
}