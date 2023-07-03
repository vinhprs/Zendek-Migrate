import { Ticket } from "src/tickets/ticket.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Field {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', { nullable: true, default: null })
    value: string;

    @ManyToMany(() => Ticket, (ticket: Ticket) => ticket.custom_fields)
    @JoinTable()
    ticket: Ticket;
}
