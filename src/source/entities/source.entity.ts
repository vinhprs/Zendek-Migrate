import { From } from "src/from/entities/from.entity";
import { To } from "src/to/entities/to.entity";
import { Via } from "src/via/entities/via.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Source {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => From, from => from.source)
    @JoinTable()
    from: From;

    @ManyToMany(() => To, to => to.source)
    @JoinTable()
    to: To;

    @Column('varchar', { nullable: true, default: null })
    rel: string;

    @ManyToMany(() => Via, via => via.source)
    @JoinTable()
    via: Via;
}
