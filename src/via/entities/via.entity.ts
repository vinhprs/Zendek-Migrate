import { Source } from "src/source/entities/source.entity";
import { Ticket } from "src/tickets/ticket.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Via {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {nullable: true, default: null})
    channel: string;

    @ManyToMany(() => Ticket, (ticket: Ticket) => ticket.via)
    @JoinTable()
    ticket: Ticket;

    @ManyToMany(() => Source, (source: Source) => source.via, {
        cascade: [
            'insert',
            'update',
        ]
    })
    @JoinTable()
    source: Source;
}
