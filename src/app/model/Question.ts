export interface Question {
    id?: string;
    question: string;
    answer: string;
    isAnswered: boolean,
    user: string;
    asignedType: string;
    assignedBy: string;
    assignedAt: any;
    anweredAt: any;
    hasAbusiveWord : boolean;
    customer: string;
}