import { From } from "src/from/entities/from.entity";
import { To } from "src/to/entities/to.entity";
import { Via } from "src/via/entities/via.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Source {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => From, from => from.source)
    from: From;

    @OneToOne(() => To, to => to.source)
    to: To;

    @Column('varchar', { nullable: true, default: null })
    rel: string;

    @OneToOne(() => Via, via => via.source)
    via: any;
}
