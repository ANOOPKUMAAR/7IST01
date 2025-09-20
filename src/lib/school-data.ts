

export const schools = [
    { id: 'engineering', name: 'School of Engineering', icon: 'School' },
    { id: 'business', name: 'School of Business', icon: 'School' },
    { id: 'arts-sciences', name: 'School of Arts & Sciences', icon: 'School' },
    { id: 'medicine', name: 'School of Medicine', icon: 'School' },
    { id: 'law', name: 'School of Law', icon: 'School' },
    { id: 'design', name: 'School of Design', icon: 'School' },
];

export interface Department {
    id: string;
    name: string;
}

export interface Program {
    id: string;
    name: string;
    description: string;
    departments: Department[];
}

export const programsBySchool: Record<string, Program[]> = {
    engineering: [
        { id: 'btech-cs', name: 'B.Tech in Computer Science', description: 'Focuses on software development and theoretical computer science.', departments: [{id: 'cs-ug', name: 'Undergraduate Computer Science'}] },
        { id: 'mtech-cs', name: 'M.Tech in Computer Science', description: 'Advanced studies in computer science and research.', departments: [{id: 'cs-pg', name: 'Postgraduate Computer Science'}] },
        { id: 'btech-mech', name: 'B.Tech in Mechanical Engineering', description: 'Covers the design, construction, and use of machines.', departments: [{id: 'mech-ug', name: 'Undergraduate Mechanical Engineering'}] },
        { id: 'btech-elec', name: 'B.Tech in Electrical Engineering', description: 'Deals with electricity, electronics, and electromagnetism.', departments: [{id: 'elec-ug', name: 'Undergraduate Electrical Engineering'}] },
        { id: 'btech-civil', name: 'B.Tech in Civil Engineering', description: 'Concerned with the design and construction of public works.', departments: [{id: 'civil-ug', name: 'Undergraduate Civil Engineering'}] },
    ],
    business: [
        { id: 'mba-fin', name: 'MBA in Finance', description: 'Prepares students for careers in financial management and analysis.', departments: [{id: 'fin-pg', name: 'Finance Department'}] },
        { id: 'bba-mark', name: 'BBA in Marketing', description: 'Focuses on branding, advertising, and consumer behavior.', departments: [{id: 'mark-ug', name: 'Marketing Department'}] },
        { id: 'mba-mgmt', name: 'MBA in Management', description: 'Covers leadership, organizational behavior, and strategic planning.', departments: [{id: 'mgmt-pg', name: 'Management Department'}] },
    ],
    'arts-sciences': [
        { id: 'bsc-phy', name: 'B.Sc in Physics', description: 'Explores the fundamental principles of the universe.', departments: [{id: 'phy-ug', name: 'Physics Department'}]},
        { id: 'ba-hist', name: 'B.A. in History', description: 'The study of past events, particularly in human affairs.', departments: [{id: 'hist-ug', name: 'History Department'}]},
        { id: 'ma-eng', name: 'M.A. in English Literature', description: 'Analyzes literary works in the English language.', departments: [{id: 'eng-pg', name: 'English Department'}]},
    ],
    medicine: [
        { id: 'mbbs', name: 'MBBS', description: 'Prepares students for medical school.', departments: [{id: 'med-ug', name: 'General Medicine'}]},
        { id: 'bsc-nur', name: 'B.Sc. in Nursing', description: 'Focuses on patient care and health promotion.', departments: [{id: 'nur-ug', name: 'Nursing Department'}]},
        { id: 'mph', name: 'Master of Public Health', description: 'Concerned with protecting and improving the health of communities.', departments: [{id: 'ph-pg', name: 'Public Health Department'}]},
    ],
    law: [
        { id: 'jd', name: 'Juris Doctor (JD)', description: 'The primary professional degree for lawyers.', departments: [{id: 'law-jd', name: 'Jurisprudence'}]},
        { id: 'para', name: 'Paralegal Studies', description: 'Trains students to assist lawyers in their legal work.', departments: [{id: 'law-para', name: 'Paralegal Department'}]},
    ],
    design: [
        { id: 'bdes-graph', name: 'B.Des in Graphic Design', description: 'Focuses on visual communication and problem-solving.', departments: [{id: 'graph-ug', name: 'Graphic Design'}]},
        { id: 'bdes-indus', name: 'B.Des in Industrial Design', description: 'The design of mass-produced products.', departments: [{id: 'indus-ug', 'name': 'Industrial Design'}]},
        { id: 'bdes-fash', name: 'B.Des in Fashion Design', description: 'The art of applying design and aesthetics to clothing.', departments: [{id: 'fash-ug', 'name': 'Fashion Design'}]},
    ],
};
