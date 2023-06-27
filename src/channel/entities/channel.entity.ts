import { Via } from "src/via/entities/via.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, default: null })
    Email: string;

    @Column('varchar', { nullable: true, default: null })
    Web: string;

    @OneToOne(() => Channel, channel => channel.via)
    via: Via;
}
