import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attachments {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', {nullable: true, default: null})
    url: string;

    @Column('varchar', {nullable: true, default: null})
    file_name: string;

    @Column('varchar', {nullable: true, default: null})
    content_url: string;

    @Column('varchar', {nullable: true, default: null})
    mapped_content_url: string;

    @Column('varchar', {nullable: true, default: null})
    content_type: string;

    @Column('int', {nullable: true, default: null})
    size: number;
    
    @Column('int', {nullable: true, default: null})
    width: number;
    
    @Column('int', {nullable: true, default: null})
    height: number;

    @Column('boolean', {nullable: true, default: false})
    inline: boolean;

    @Column('boolean', {nullable: true, default: false})
    deleted: boolean;

    @OneToMany(() => Attachments, (child: Attachments) => child.photo)
    thumbnails: Attachments[];

    @ManyToOne(() => Attachments, (photo: Attachments) => photo.thumbnails)
    photo?: Attachments;

    @OneToOne(() => User, (user: User) => user.photo)
    user?: User;
}