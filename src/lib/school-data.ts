
import type { Student } from './types';

export const schools = [
    { id: 'engineering', name: 'School of Engineering', icon: 'School' },
    { id: 'business', name: 'School of Business', icon: 'School' },
    { id: 'arts-sciences', name: 'School of Arts & Sciences', icon: 'School' },
    { id: 'medicine', name: 'School of Medicine', icon: 'School' },
    { id: 'law', name: 'School of Law', icon: 'School' },
    { id: 'design', name: 'School of Design', icon: 'School' },
];

export interface Class {
    id: string;
    name: string;
    coordinator: string;
    students?: Student[];
    day: string;
    startTime: string;
    endTime: string;
    faculties?: string[];
}

export interface Department {
    id: string;
    name: string;
    hod: string;
    classes?: Class[];
}

export interface Program {
    id: string;
    name: string;
    description: string;
    departments: Department[];
}

const mockStudents: Student[] = [
    { id: 's1', name: 'Bob Johnson', rollNo: '20221IST0002' },
    { id: 's2', name: 'Charlie Brown', rollNo: '20221IST0003' },
    { id: 's3', name: 'Diana Prince', rollNo: '20221IST0004' },
    { id: 's4', name: 'Ethan Hunt', rollNo: '20221IST0005' },
    { id: 's5', name: 'Fiona Glenanne', rollNo: '20221IST0006' },
];

export const programsBySchool: Record<string, Program[]> = {
    engineering: [
        { id: 'btech-cs', name: 'B.Tech in Computer Science', description: 'Focuses on software development and theoretical computer science.', departments: [
            {id: 'cs-ug', name: 'UG Computer Science', hod: 'Dr. Alan Turing', classes: [
                { id: 'cs101', name: 'Introduction to Programming', coordinator: 'Prof. Ada Lovelace', students: mockStudents.slice(0, 2), day: 'Monday', startTime: '09:00', endTime: '10:30', faculties: ['Prof. Ada Lovelace', 'Dr. Grace Hopper'] },
                { id: 'cs201', name: 'Data Structures', coordinator: 'Prof. Niklaus Wirth', students: mockStudents.slice(2, 5), day: 'Wednesday', startTime: '11:00', endTime: '12:30', faculties: ['Prof. Niklaus Wirth'] },
            ]},
            {id: 'cs-ai', name: 'Artificial Intelligence', hod: 'Dr. John McCarthy', classes: [
                { id: 'ai301', name: 'Intro to AI', coordinator: 'Prof. Geoffrey Hinton', students: mockStudents.slice(1, 3), day: 'Tuesday', startTime: '14:00', endTime: '15:30', faculties: ['Prof. Geoffrey Hinton'] },
                { id: 'ai401', name: 'Machine Learning', coordinator: 'Prof. Andrew Ng', students: mockStudents.slice(0, 4), day: 'Thursday', startTime: '10:00', endTime: '11:30', faculties: ['Prof. Andrew Ng', 'Dr. Yann LeCun'] },
            ]},
            {id: 'cs-cyber', name: 'Cybersecurity', hod: 'Dr. Kevin Mitnick', classes: [
                { id: 'cyb301', name: 'Network Security', coordinator: 'Prof. Ron Rivest', students: mockStudents.slice(3, 5), day: 'Friday', startTime: '13:00', endTime: '14:30', faculties: ['Prof. Ron Rivest', 'Prof. Adi Shamir'] },
            ]},
            {id: 'cs-ds', name: 'Data Science', hod: 'Dr. DJ Patil', classes: [
                 { id: 'ds301', name: '7IST01', coordinator: 'Prof. Jeff Hammerbacher', students: mockStudents.slice(0, 3), day: 'Monday', startTime: '16:00', endTime: '17:30', faculties: ['Prof. Jeff Hammerbacher'] },
            ]},
        ] },
        { id: 'mtech-cs', name: 'M.Tech in Computer Science', description: 'Advanced studies in computer science and research.', departments: [{id: 'cs-pg', name: 'Postgraduate Computer Science', hod: 'Dr. Grace Hopper'}] },
        { id: 'btech-mech', name: 'B.Tech in Mechanical Engineering', description: 'Covers the design, construction, and use of machines.', departments: [
            {id: 'mech-ug', name: 'Undergraduate Mechanical Engineering', hod: 'Dr. James Watt'},
            {id: 'mech-robotics', name: 'Robotics', hod: 'Dr. Joseph Engelberger'},
            {id: 'mech-thermo', name: 'Thermal Engineering', hod: 'Dr. Sadi Carnot'},
        ] },
        { id: 'btech-elec', name: 'B.Tech in Electrical Engineering', description: 'Deals with electricity, electronics, and electromagnetism.', departments: [
            {id: 'elec-ug', name: 'Undergraduate Electrical Engineering', hod: 'Dr. Nikola Tesla'},
            {id: 'elec-vlsi', name: 'VLSI Design', hod: 'Dr. Gordon Moore'},
            {id: 'elec-power', name: 'Power Systems', hod: 'Dr. Edith Clarke'},
        ] },
        { id: 'btech-civil', name: 'B.Tech in Civil Engineering', description: 'Concerned with the design and construction of public works.', departments: [{id: 'civil-ug', name: 'Undergraduate Civil Engineering', hod: 'Dr. John Smeaton'}] },
    ],
    business: [
        { id: 'mba-fin', name: 'MBA in Finance', description: 'Prepares students for careers in financial management and analysis.', departments: [{id: 'fin-pg', name: 'Finance Department', hod: 'Dr. Eugene Fama'}] },
        { id: 'bba-mark', name: 'BBA in Marketing', description: 'Focuses on branding, advertising, and consumer behavior.', departments: [{id: 'mark-ug', name: 'Marketing Department', hod: 'Dr. Philip Kotler'}] },
        { id: 'mba-mgmt', name: 'MBA in Management', description: 'Covers leadership, organizational behavior, and strategic planning.', departments: [{id: 'mgmt-pg', name: 'Management Department', hod: 'Dr. Peter Drucker'}] },
    ],
    'arts-sciences': [
        { id: 'bsc-phy', name: 'B.Sc in Physics', description: 'Explores the fundamental principles of the universe.', departments: [{id: 'phy-ug', name: 'Physics Department', hod: 'Dr. Albert Einstein'}]},
        { id: 'ba-hist', name: 'B.A. in History', description: 'The study of past events, particularly in human affairs.', departments: [{id: 'hist-ug', name: 'History Department', hod: 'Dr. Herodotus'}]},
        { id: 'ma-eng', name: 'M.A. in English Literature', description: 'Analyzes literary works in the English language.', departments: [{id: 'eng-pg', name: 'English Department', hod: 'Dr. William Shakespeare'}]},
    ],
    medicine: [
        { id: 'mbbs', name: 'MBBS', description: 'Prepares students for medical school.', departments: [{id: 'med-ug', name: 'General Medicine', hod: 'Dr. Hippocrates'}]},
        { id: 'bsc-nur', name: 'B.Sc. in Nursing', description: 'Focuses on patient care and health promotion.', departments: [{id: 'nur-ug', name: 'Nursing Department', hod: 'Dr. Florence Nightingale'}]},
        { id: 'mph', name: 'Master of Public Health', description: 'Concerned with protecting and improving the health of communities.', departments: [{id: 'ph-pg', name: 'Public Health Department', hod: 'Dr. John Snow'}]},
    ],
    law: [
        { id: 'jd', name: 'Juris Doctor (JD)', description: 'The primary professional degree for lawyers.', departments: [{id: 'law-jd', name: 'Jurisprudence', hod: 'Dr. John Austin'}]},
        { id: 'para', name: 'Paralegal Studies', description: 'Trains students to assist lawyers in their legal work.', departments: [{id: 'law-para', name: 'Paralegal Department', hod: 'Dr. Erin Brockovich'}]},
    ],
    design: [
        { id: 'bdes-graph', name: 'B.Des in Graphic Design', description: 'Focuses on visual communication and problem-solving.', departments: [{id: 'graph-ug', name: 'Graphic Design', hod: 'Dr. Paul Rand'}]},
        { id: 'bdes-indus', name: 'B.Des in Industrial Design', description: 'The design of mass-produced products.', departments: [{id: 'indus-ug', name: 'Industrial Design', hod: 'Dr. Dieter Rams'}]},
        { id: 'bdes-fash', name: 'B.Des in Fashion Design', description: 'The art of applying design and aesthetics to clothing.', departments: [{id: 'fash-ug', name: 'Fashion Design', hod: 'Dr. Coco Chanel'}]},
    ],
};
