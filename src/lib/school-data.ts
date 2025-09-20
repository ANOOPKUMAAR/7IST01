
export const schools = [
    { id: 'engineering', name: 'School of Engineering', icon: 'School' },
    { id: 'business', name: 'School of Business', icon: 'School' },
    { id: 'arts-sciences', name: 'School of Arts & Sciences', icon: 'School' },
    { id: 'medicine', name: 'School of Medicine', icon: 'School' },
    { id: 'law', name: 'School of Law', icon: 'School' },
    { id: 'design', name: 'School of Design', icon: 'School' },
];

export const programsBySchool: Record<string, {name: string, description: string}[]> = {
    engineering: [
        { name: 'B.Tech in Computer Science', description: 'Focuses on software development and theoretical computer science.' },
        { name: 'M.Tech in Computer Science', description: 'Advanced studies in computer science and research.' },
        { name: 'B.Tech in Mechanical Engineering', description: 'Covers the design, construction, and use of machines.' },
        { name: 'B.Tech in Electrical Engineering', description: 'Deals with electricity, electronics, and electromagnetism.' },
        { name: 'B.Tech in Civil Engineering', description: 'Concerned with the design and construction of public works.' },
    ],
    business: [
        { name: 'MBA in Finance', description: 'Prepares students for careers in financial management and analysis.' },
        { name: 'BBA in Marketing', description: 'Focuses on branding, advertising, and consumer behavior.' },
        { name: 'MBA in Management', description: 'Covers leadership, organizational behavior, and strategic planning.' },
    ],
    'arts-sciences': [
        { name: 'B.Sc in Physics', description: 'Explores the fundamental principles of the universe.' },
        { name: 'B.A. in History', description: 'The study of past events, particularly in human affairs.' },
        { name: 'M.A. in English Literature', description: 'Analyzes literary works in the English language.' },
    ],
    medicine: [
        { name: 'MBBS', description: 'Prepares students for medical school.' },
        { name: 'B.Sc. in Nursing', description: 'Focuses on patient care and health promotion.' },
        { name: 'Master of Public Health', description: 'Concerned with protecting and improving the health of communities.' },
    ],
    law: [
        { name: 'Juris Doctor (JD)', description: 'The primary professional degree for lawyers.' },
        { name: 'Paralegal Studies', description: 'Trains students to assist lawyers in their legal work.' },
    ],
    design: [
        { name: 'B.Des in Graphic Design', description: 'Focuses on visual communication and problem-solving.' },
        { name: 'B.Des in Industrial Design', description: 'The design of mass-produced products.' },
        { name: 'B.Des in Fashion Design', description: 'The art of applying design and aesthetics to clothing.' },
    ],
};
