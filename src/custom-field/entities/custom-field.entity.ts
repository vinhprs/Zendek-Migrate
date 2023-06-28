import { Ticket } from "src/tickets/ticket.entity";
import { Column, Entity, ManyToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class CustomField {
    @PrimaryColumn('bigint')
    id: number;

    @Column('varchar', { nullable: true, default: null })
    value: string;

    @ManyToMany(() => Ticket, (ticket: Ticket) => ticket.fields)
    ticket: Ticket;
}